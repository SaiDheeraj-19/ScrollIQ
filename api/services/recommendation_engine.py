import json
from typing import List, Tuple, Dict, Optional
from models.schemas import (
    CandidateReel, InterestProfile, RecommendationResponse, 
    UnifiedInteraction, UserGoal, GoalAlignment, ScoreBreakdown, RejectedAlternative,
    KnowledgeGap, GoalMilestone
)
from services.ai_service import get_structured_response
from services.quality_engine import evaluate_quality


async def generate_recommendation_directions(
    profile: InterestProfile, 
    recent_interactions: List[UnifiedInteraction],
    user_goal: Optional[UserGoal] = None
) -> List[str]:
    """Generate adjacent learning directions based on latent interest + user goal."""
    system_prompt = """
    You are an AI generating learning directions for a student.
    Given their primary latent interest AND stated goal, generate 3 useful specific adjacent technical learning directions.
    
    CRITICAL RULE: The User's Stated Goal is the ABSOLUTE PRIMARY DIRECTIVE. Your generated learning directions MUST be direct subsets, skills, or requirements of their STATED GOAL.
    If their latent interest is unrelated to their goal (e.g., 'gaming' vs goal 'AI Engineer'), IGNORE the latent interest and ONLY focus on their STATED GOAL.
    These should NOT simply repeat the primary interest.
    They should be the NEXT USEFUL LEARNING STEPS.
    
    Example: 'Software Engineering' + goal 'Backend Dev' -> ['System Design', 'Distributed Systems', 'Cloud Deployment']
    Example: 'AI/ML Engineering' + goal 'AI Engineer' -> ['LLM Engineering', 'RAG Systems', 'ML Infrastructure']
    """
    
    goal_text = user_goal.goal_description if user_goal else "None specified"
    user_prompt = f"Primary Latent Interest: {profile.primaryInterest.name}\nUser Goal: {goal_text}\nRecent Topic: {recent_interactions[-1].title if recent_interactions else 'None'}"
    schema = {"directions": ["string"]}
    
    try:
        response = await get_structured_response(system_prompt, user_prompt, response_format=schema)
        return response.get("directions", [profile.primaryInterest.name])
    except:
        return [profile.primaryInterest.name]


async def calculate_goal_alignment(
    user_goal: Optional[UserGoal],
    primary_interest: str,
    direction: str
) -> GoalAlignment:
    """Calculate semantic alignment between user goal and the inferred interest + direction."""
    if not user_goal or not user_goal.goal:
        return GoalAlignment(score=0.5, label="Unknown", reason="No goal specified by the user.", mismatch_detected=False)
    
    system_prompt = """
    You are analyzing the alignment between a user's stated goal and their inferred behavioral interest.
    Return a JSON with:
    - score: float 0.0 to 1.0 (semantic similarity)
    - label: "High" (>0.7), "Medium" (0.4-0.7), "Low" (<0.4), or "Mismatch" if fundamentally different domains
    - reason: one sentence explaining the alignment or mismatch
    - mismatch_detected: boolean, true if goal and behavior suggest very different domains
    """
    
    user_prompt = f"""
    User Goal: "{user_goal.goal_description or user_goal.goal}"
    Inferred Latent Interest: "{primary_interest}"
    Recommendation Direction: "{direction}"
    
    Analyze: does the user's behavior support their stated goal, or are there signs of misalignment?
    """
    schema = {
        "score": 0.0,
        "label": "string",
        "reason": "string",
        "mismatch_detected": False
    }
    
    try:
        response = await get_structured_response(system_prompt, user_prompt, response_format=schema)
        return GoalAlignment(
            score=float(response.get("score", 0.5)),
            label=response.get("label", "Medium"),
            reason=response.get("reason", ""),
            mismatch_detected=bool(response.get("mismatch_detected", False))
        )
    except:
        return GoalAlignment(score=0.5, label="Medium", reason="Unable to calculate alignment.", mismatch_detected=False)


def score_candidate(
    candidate: CandidateReel,
    profile: InterestProfile,
    direction: str,
    recent_interactions: List[UnifiedInteraction],
    user_goal: Optional[UserGoal] = None,
    goal_alignment_score: float = 0.5
) -> Tuple[float, ScoreBreakdown]:
    """
    Deterministic candidate scoring using the official 5-factor weighted formula:
    - Interest Match:       25%
    - Goal Alignment:       25%
    - Latent Interest Match: 15%
    - Context Match:        15%
    - Educational Value:    20%
    Then apply Hype Penalty.
    """
    
    primary_name = profile.primaryInterest.name.lower()
    candidate_cat = candidate.category.lower()
    candidate_title = candidate.title.lower()
    candidate_desc = candidate.description.lower()
    direction_lower = direction.lower()
    
    # 1. Interest Match (25%) — does candidate match the recommendation direction?
    if direction_lower in candidate_title or direction_lower in candidate_desc:
        interest_match = 0.25
    elif any(tag.lower() in candidate_title or tag.lower() in candidate_desc 
             for tag in profile.surface_topics):
        interest_match = 0.18
    else:
        interest_match = 0.08

    # 2. Goal Alignment (25%) — does candidate serve the user's goal?
    goal_alignment_contribution = goal_alignment_score * 0.25
    
    # 3. Latent Interest Match (15%) — does candidate connect to the deeper interest?
    if primary_name in candidate_cat or primary_name in candidate_title:
        latent_interest_match = 0.15
    elif any(w in candidate_title for w in primary_name.split()):
        latent_interest_match = 0.10
    else:
        latent_interest_match = 0.05

    # 4. Context Match (15%) — is this a sensible next step?
    # Proxy: educational value and technical level alignment
    if candidate.educationalValue > 0.7:
        context_match = 0.15
    elif candidate.educationalValue > 0.5:
        context_match = 0.10
    else:
        context_match = 0.04

    # 5. Educational Value (20%) — raw quality signal
    educational_value = candidate.educationalValue * 0.20

    # Bonus signals (secondary)
    novelty = 0.0
    difficulty_fit = 0.05  # default bonus
    format_diversity = 0.03

    # Check for repetition (novelty penalty)
    for r in recent_interactions:
        if r.contentId == candidate.videoId or r.title.lower() == candidate.title.lower():
            novelty = -0.20  # Strong repetition penalty
            
    # Check for negative signals (Swiped away quickly)
    for neg_signal in profile.contradicting_signals:
        if neg_signal.lower() in candidate_title or neg_signal.lower() in candidate_cat:
            novelty -= 0.40  # Massive penalty for recommending things they don't like

    # Hype Penalty
    hype_penalty = 0.0
    if candidate.hypeScore > 0.7:
        hype_penalty = -(candidate.hypeScore * 0.35)
    elif candidate.hypeScore > 0.5:
        hype_penalty = -(candidate.hypeScore * 0.15)

    total = (
        interest_match
        + goal_alignment_contribution
        + latent_interest_match
        + context_match
        + educational_value
        + novelty
        + difficulty_fit
        + format_diversity
        + hype_penalty
    )
    
    breakdown = ScoreBreakdown(
        interest_match=round(interest_match, 3),
        goal_alignment=round(goal_alignment_contribution, 3),
        latent_interest_match=round(latent_interest_match, 3),
        context_match=round(context_match, 3),
        educational_value=round(educational_value, 3),
        novelty=round(novelty, 3),
        difficulty_fit=round(difficulty_fit, 3),
        format_diversity=round(format_diversity, 3),
        hype_score=round(candidate.hypeScore, 3),
        hype_penalty=round(hype_penalty, 3),
        final_score=round(total, 3)
    )
    
    return total, breakdown


async def infer_knowledge_gap_and_progress(
    user_goal: Optional[UserGoal],
    primary_interest: str,
    recent_interactions: List[UnifiedInteraction],
    recommendation_direction: str
) -> Tuple[Optional[KnowledgeGap], List[GoalMilestone]]:
    if not user_goal or not user_goal.goal:
        return None, []
        
    system_prompt = """
    You are an AI generating a learning roadmap and identifying a Knowledge Gap for a student.
    Given their Stated Goal, their inferred Latent Interest, the topics they just watched, and their Next Recommendation Direction:
    1. Identify a 'Knowledge Gap' (the missing skill between their current behavior and their goal, usually the Next Direction).
    2. Generate a 5 to 7 step 'Goal Progress' roadmap toward their Stated Goal.
       - Use specific technical topics for the steps.
       - Assign EXACTLY ONE of these statuses to each step: "Observed", "Exploring", "Learning", "Next", "Future".
       - The user's recently watched topics should map to "Observed", "Exploring", or "Learning".
       - The Next Direction MUST map to "Next".
       - Advanced topics beyond the Next Direction map to "Future".
    """
    
    recent_topics = [i.title for i in recent_interactions[-3:]]
    user_prompt = f"""
    User Goal: {user_goal.goal}
    Latent Interest: {primary_interest}
    Recently Watched Topics: {recent_topics}
    Next Recommended Direction: {recommendation_direction}
    """
    
    schema = {
        "knowledge_gap": {
            "topic": "string",
            "reason": "string"
        },
        "goal_progress": [
            {
                "topic": "string",
                "status": "string"
            }
        ]
    }
    
    try:
        response = await get_structured_response(system_prompt, user_prompt, response_format=schema)
        
        kg_data = response.get("knowledge_gap", {})
        gap = KnowledgeGap(
            topic=kg_data.get("topic", recommendation_direction),
            reason=kg_data.get("reason", "This is the next logical step toward your goal.")
        )
        
        progress = []
        for p in response.get("goal_progress", []):
            status = p.get("status", "Future")
            if status not in ["Observed", "Exploring", "Learning", "Next", "Future"]:
                status = "Future"
            progress.append(GoalMilestone(topic=p.get("topic", "Unknown"), status=status))
            
        return gap, progress
    except Exception as e:
        print(f"Failed to infer knowledge gap: {e}")
        return None, []


async def rank_candidates_and_recommend(
    profile: InterestProfile,
    all_candidates: List[CandidateReel],
    recent_interactions: List[UnifiedInteraction],
    direction: str,
    user_goal: Optional[UserGoal] = None,
    goal_alignment: Optional[GoalAlignment] = None
) -> RecommendationResponse:
    
    goal_alignment_score = goal_alignment.score if goal_alignment else 0.5
    
    valid_candidates = []
    rejected_candidates = []
    rejected_titles = []
    
    for c in all_candidates:
        q_score, is_rejected = evaluate_quality(c)
        if is_rejected:
            rejected_titles.append(c.title)
            rejected_candidates.append(c)
        else:
            valid_candidates.append(c)
            
    if not valid_candidates:
        valid_candidates = all_candidates
    
    # Rank deterministically
    ranked = []
    for c in valid_candidates:
        total, breakdown = score_candidate(
            c, profile, direction, recent_interactions, user_goal, goal_alignment_score
        )
        ranked.append((total, c, breakdown))
        
    ranked.sort(key=lambda x: x[0], reverse=True)
    
    winning_score, winning_candidate, winning_breakdown = ranked[0]
    
    # Identify strongest rejected alternative (Why Not)
    rejected_alternative = None
    why_not = None
    
    if rejected_candidates:
        worst = rejected_candidates[0]
        rejected_alternative = RejectedAlternative(
            title=worst.title,
            reason=f"This candidate was rejected due to high hype score ({worst.hypeScore:.1f}/1.0) and low educational value ({worst.educationalValue:.1f}/1.0). It makes exaggerated claims without providing technical depth."
        )
        why_not = rejected_alternative.reason
    elif len(ranked) > 1:
        runner_up = ranked[1][1]
        rejected_alternative = RejectedAlternative(
            title=runner_up.title,
            reason=f"'{runner_up.title}' scored lower because it had weaker alignment with the direction '{direction}' compared to the winning candidate."
        )
        why_not = rejected_alternative.reason

    anti_hype_applied = len(rejected_candidates) > 0

    # Generate "Why This" explanation via LLM
    goal_text = user_goal.goal_description if user_goal else "Not specified"
    system_prompt = """You are explaining a recommendation to a student. 
    Write 2-3 sentences explaining WHY this specific video was chosen.
    Connect it to their stated goal, inferred latent interest, and the specific learning direction.
    Do NOT say 'This video matches your interests.' Be specific and actionable."""
    
    user_prompt = f"""
    User Goal: {goal_text}
    Latent Interest: {profile.primaryInterest.name}
    Direction: {direction}
    Chosen Video: {winning_candidate.title}
    Category: {winning_candidate.category}
    Educational Value: {winning_candidate.educationalValue}
    """
    schema = {"whyRecommendation": "string", "evidence_bullets": ["string"]}
    
    try:
        response = await get_structured_response(system_prompt, user_prompt, response_format=schema)
        final_why_rec = response.get("whyRecommendation", "")
        why_evidence = response.get("evidence_bullets", [])
    except:
        final_why_rec = f"Based on your interest in {profile.primaryInterest.name}, this video on {direction} is a natural and high-value next step."
        why_evidence = []

    # Current reel = most recently interacted content
    current_reel_id = recent_interactions[-1].id if recent_interactions else "None"
    current_reel_title = recent_interactions[-1].title if recent_interactions else "None"

    return RecommendationResponse(
        currentReel=current_reel_id,
        currentReelTitle=current_reel_title,
        interestDetected=profile.primaryInterest.name,
        why=profile.reasoning or "Based on your behavioral signals.",
        why_evidence=why_evidence,
        recommendedTechReel=winning_candidate.title,
        category=winning_candidate.category,
        whyRecommendation=final_why_rec,
        difficulty=winning_candidate.difficulty,
        confidence=profile.confidence_label,
        user_goal=user_goal,
        goal_alignment=goal_alignment,
        recommendation_direction=direction,
        antiHypeFilterApplied=anti_hype_applied,
        rejectedCandidates=rejected_titles + [r[1].title for r in ranked[1:2]],
        whyNot=why_not,
        rejected_alternative=rejected_alternative,
        candidateId=winning_candidate.id,
        videoId=winning_candidate.videoId,
        channel=winning_candidate.channel,
        videoUrl=winning_candidate.url or (f"https://youtube.com/shorts/{winning_candidate.videoId}" if winning_candidate.videoId else None),
        score_breakdown=winning_breakdown,
        surface_topics=profile.surface_topics,
    )
