from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Union

class BehaviorSignals(BaseModel):
    watchPercent: Optional[float] = None  # null if unavailable
    liked: Optional[bool] = None
    saved: Optional[bool] = None
    shared: Optional[bool] = None
    rewatched: Optional[bool] = None
    skipped: Optional[bool] = None

class Creator(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None

class UnifiedInteraction(BaseModel):
    id: str
    source: Literal["instagram", "youtube", "demo", "scrolliq"]
    contentType: Literal["reel", "short", "video"]
    contentId: str
    title: str
    description: Optional[str] = None
    transcript: Optional[str] = None
    thumbnailUrl: Optional[str] = None
    contentUrl: Optional[str] = None
    channel: Optional[str] = None
    creator: Optional[Creator] = None
    publishedAt: Optional[str] = None
    interactedAt: Optional[str] = None
    behavior: BehaviorSignals = BehaviorSignals()
    category: Optional[str] = None

class AnalyzedContent(BaseModel):
    id: str
    topic: str
    broaderDomain: str
    context: str
    apparentIntent: str
    technicalLevel: str
    educationalValue: float
    hypeScore: float
    semanticTags: List[str]

class Evidence(BaseModel):
    content_id: str
    surface_topic: str
    semantic_connection: str
    observed_signal: str
    strength: float

class Interest(BaseModel):
    name: str
    score: float
    evidence: List[Evidence] = []

class AlternativeInterpretation(BaseModel):
    interest: str
    confidence: str
    reason: str

class PrimaryInterest(BaseModel):
    name: str
    confidence: str
    score: float

class UserGoal(BaseModel):
    goal: str = ""
    goal_description: str = ""
    goal_categories: List[str] = []

class GoalAlignment(BaseModel):
    score: float = 0.0
    label: str = "Medium"  # High / Medium / Low / Mismatch
    reason: str = ""
    mismatch_detected: bool = False

class InterestProfile(BaseModel):
    primaryInterest: PrimaryInterest
    supportingInterests: List[Interest] = []
    evidence: List[Evidence] = []
    surface_topics: List[str] = []
    contradicting_signals: List[str] = []
    confidence_label: str = "Medium"
    reasoning: str = ""
    alternativeInterpretations: List[AlternativeInterpretation] = []
    analyzedContent: Dict[str, AnalyzedContent] = {}
    goal_alignment: Optional[GoalAlignment] = None

class CandidateReel(BaseModel):
    id: str
    videoId: Optional[str] = None
    title: str
    description: str
    category: str
    channel: Optional[str] = None
    url: Optional[str] = None
    difficulty: Literal["Beginner", "Intermediate", "Advanced"] = "Intermediate"
    educationalValue: float
    hypeScore: float

class ScoreBreakdown(BaseModel):
    interest_match: float = 0.0
    goal_alignment: float = 0.0
    latent_interest_match: float = 0.0
    context_match: float = 0.0
    educational_value: float = 0.0
    novelty: float = 0.0
    difficulty_fit: float = 0.0
    format_diversity: float = 0.0
    hype_score: float = 0.0
    hype_penalty: float = 0.0
    final_score: float = 0.0

class RejectedAlternative(BaseModel):
    title: str
    reason: str

class RecommendedArticle(BaseModel):
    title: str
    url: str
    content: str

class RecommendationResponse(BaseModel):
    # Core output contract fields
    currentReel: str
    currentReelTitle: Optional[str] = None
    interestDetected: str
    why: str  # reasoning narrative
    why_evidence: List[str] = []  # evidence bullets
    recommendedTechReel: str
    category: str
    whyRecommendation: str
    difficulty: str
    confidence: str
    # Goal
    user_goal: Optional[UserGoal] = None
    goal_alignment: Optional[GoalAlignment] = None
    # Direction
    recommendation_direction: Optional[str] = None
    # Anti-hype
    antiHypeFilterApplied: bool = False
    rejectedCandidates: List[str] = []
    whyNot: Optional[str] = None
    rejected_alternative: Optional[RejectedAlternative] = None
    # Candidate details
    candidateId: str
    videoId: Optional[str] = None
    channel: Optional[str] = None
    videoUrl: Optional[str] = None
    # Score breakdown
    score_breakdown: Optional[ScoreBreakdown] = None
    # Surface topics
    surface_topics: List[str] = []
    # Baseline comparison
    baseline: Optional["RecommendationResponse"] = None
    # Deep Dive Article (via Tavily)
    recommendedArticle: Optional[RecommendedArticle] = None

class AnalyzeRequest(BaseModel):
    interactions: List[UnifiedInteraction]
    user_goal: Optional[UserGoal] = None

class RecommendRequest(BaseModel):
    profile: InterestProfile
    recent_interactions: List[UnifiedInteraction]
    providerToken: Optional[str] = None
    user_goal: Optional[UserGoal] = None

class FeedbackRequest(BaseModel):
    recommendationId: str
    action: Literal["relevant", "irrelevant", "saved", "not_interested"]

# Needed for self-referential models in Pydantic v2
RecommendationResponse.model_rebuild()
