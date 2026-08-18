from typing import List, Optional
from models.schemas import UnifiedInteraction, AnalyzedContent, InterestProfile, UserGoal
from services.ai_service import get_structured_response
from services.behavior_engine import calculate_behavior_score

async def infer_interest_dna(
    interactions: List[UnifiedInteraction], 
    analyzed_content: List[AnalyzedContent],
    user_goal: Optional[UserGoal] = None
) -> InterestProfile:
    """
    Phase 6: Persistent Interest Engine.
    Consumes interactions and their analyzed content, leveraging behavior weights to infer deep latent interests.
    """
    system_prompt = """
    You are an AI Interest Discovery Agent.
    Your goal is to infer a user's deeper, underlying latent/persistent interests based on their behavior interacting with short-form videos.
    DO NOT just match keywords. Look for the thread that connects them.
    If a user watches a Java meme, a coding interview joke, and a laptop review, the underlying interest is 'Software Engineering'.
    Use the provided behavioral weights and evidence to determine the strength of the interest.
    CRITICAL: If a signal is negative (e.g. Swiped away quickly, score < 0), explicitly note that the user is NOT interested in those topics, and add them to contradicting_signals.
    """
    
    goal_context = ""
    if user_goal and user_goal.goal:
        goal_context = f"\n\nUser's Stated Goal: {user_goal.goal_description or user_goal.goal}\nConsider whether behavior aligns with this goal or reveals a different underlying interest."

    user_prompt = "User Interaction History:\n" + goal_context
    for r, ac in zip(interactions, analyzed_content):
        beh_data = calculate_behavior_score(r)
        user_prompt += f"- ID: {r.id} | [Signal: {beh_data['weight']} ({beh_data['score']:.2f}) | Evidence: {beh_data['evidence_string']}] Title: '{r.title}' -> Domain: {ac.broaderDomain}, Intent: {ac.apparentIntent}, Tags: {', '.join(ac.semanticTags)}\n"
        
    schema = {
        "primaryInterest": {
            "name": "string",
            "confidence": "string",
            "score": 0.0
        },
        "supportingInterests": [
            {
                "name": "string",
                "score": 0.0
            }
        ],
        "evidence": [
             {
                "content_id": "string",
                "surface_topic": "string",
                "semantic_connection": "string",
                "observed_signal": "string",
                "strength": 0.0
            }
        ],
        "surface_topics": ["string"],
        "contradicting_signals": ["string"],
        "confidence_label": "string",
        "reasoning": "string",
        "alternativeInterpretations": [
            {
                "interest": "string",
                "confidence": "string",
                "reason": "string"
            }
        ]
    }
    
    response = await get_structured_response(system_prompt, user_prompt, response_format=schema)
    
    return InterestProfile(**response)
