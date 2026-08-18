from fastapi import APIRouter, HTTPException, Depends
from models.schemas import UserGoal, InterestProfile, UnifiedInteraction, BehaviorSignals, RecommendationResponse
from services.behavior_engine import calculate_behavior_score
from services.content_analyzer import analyze_multiple_interactions
from services.interest_engine import infer_interest_dna
from services.recommendation_engine import rank_candidates_and_recommend
from typing import Dict, List, Optional
from pydantic import BaseModel
import datetime

router = APIRouter()

class ExtensionVideoEvent(BaseModel):
    platform: str
    videoId: str
    title: str
    url: str
    eventType: str
    watchSeconds: float = 0.0
    watchPercentage: float = 0.0
    timestamp: str

class ExtensionEventRequest(BaseModel):
    event: ExtensionVideoEvent
    userGoal: Optional[UserGoal] = None

# IN-MEMORY SESSION STORE (For hackathon simplicity. Normally this would be a DB/Redis keyed by user session)
# We store recent interactions here.
SESSION_STORE: Dict[str, List[UnifiedInteraction]] = {}

def get_session_id():
    # In a real app we'd extract the user ID from the Authorization header.
    # For this demo, we'll use a single global session or a fixed string since we're testing locally.
    return "demo_session_1"

@router.post("/events")
async def receive_extension_event(req: ExtensionEventRequest):
    """
    Receives raw behavior events from the Chrome Extension.
    Translates them into the existing ScrollIQ intelligence pipeline.
    """
    session_id = get_session_id()
    if session_id not in SESSION_STORE:
        SESSION_STORE[session_id] = []
        
    ev = req.event
    
    # 1. Translate Extension Event -> ScrollIQ Behavior Signal
    # The behavior engine wants watchPercent as duration in seconds (based on existing engine logic).
    beh = BehaviorSignals(
        watchPercent=ev.watchSeconds,
        skipped=(ev.eventType == "skip"),
        rewatched=(ev.eventType == "replay")
    )
    
    interaction = UnifiedInteraction(
        id=f"ext_{ev.videoId}_{len(SESSION_STORE[session_id])}",
        source=ev.platform, # e.g. "youtube"
        contentType="short" if "shorts" in ev.url else "video",
        contentId=ev.videoId,
        title=ev.title,
        contentUrl=ev.url,
        behavior=beh,
        interactedAt=ev.timestamp
    )
    
    # Check if we already have this video ID in this session. If so, update it instead of duplicating.
    existing_idx = next((i for i, v in enumerate(SESSION_STORE[session_id]) if v.contentId == ev.videoId), None)
    
    if existing_idx is not None:
        # Update existing
        existing = SESSION_STORE[session_id][existing_idx]
        # Only update if the new watch time is greater
        if (beh.watchPercent or 0) > (existing.behavior.watchPercent or 0):
            existing.behavior.watchPercent = beh.watchPercent
        if beh.rewatched:
            existing.behavior.rewatched = True
        SESSION_STORE[session_id][existing_idx] = existing
        interaction = existing
    else:
        # Add new
        SESSION_STORE[session_id].append(interaction)
        
    # We only keep the last 10 interactions in memory to avoid stale context.
    if len(SESSION_STORE[session_id]) > 10:
        SESSION_STORE[session_id] = SESSION_STORE[session_id][-10:]

    history = SESSION_STORE[session_id]
    
    # 2. Data Sufficiency Check
    if len(history) < 3:
        return {
            "status": "accumulating",
            "message": f"Collected {len(history)}/3 interactions. Keep scrolling.",
            "profile": None
        }
        
    # 3. We have enough data! Run it through the existing pipeline.
    try:
        # Get the most recent 6 for analysis to prevent huge context
        to_analyze = history[-6:]
        
        # A) Analyze Content
        analyzed_content = await analyze_multiple_interactions(to_analyze)
        
        # B) Infer Latent Interest & Goal Alignment
        profile = await infer_interest_dna(
            to_analyze,
            analyzed_content,
            user_goal=req.userGoal
        )
        
        # Attach the content mapping
        profile.analyzedContent = {ac.id: ac for ac in analyzed_content}
        
        # C) Generate Recommendation & Knowledge Gap & Anti-Hype
        # We need to pass dummy candidates since the extension provides none by default, 
        # but the engine handles this internally or we can fallback to the dataset.
        recommendation = await rank_candidates_and_recommend(
            profile,
            all_candidates=[], # Mock candidates handled by engine internally
            recent_interactions=to_analyze,
            direction=profile.primaryInterest.name,
            user_goal=req.userGoal
        )
        
        return {
            "status": "analyzed",
            "profile": profile.model_dump(),
            "recommendation": recommendation.model_dump()
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Extension analysis failed: {str(e)}")

class FeedbackRequest(BaseModel):
    recommendationId: str
    action: str

@router.post("/feedback")
async def receive_extension_feedback(req: FeedbackRequest):
    # In a real system, we'd log this to the database to improve future weights.
    print(f"Received feedback '{req.action}' for recommendation {req.recommendationId}")
    return {"status": "success", "message": "Feedback recorded."}
