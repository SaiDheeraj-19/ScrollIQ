from fastapi import APIRouter, HTTPException
from models.schemas import AnalyzeRequest, InterestProfile
from services.interest_engine import infer_interest_dna
from services.content_analyzer import analyze_multiple_interactions
import traceback

router = APIRouter()

@router.post("/analyze", response_model=InterestProfile)
async def analyze_reels(request: AnalyzeRequest):
    """
    Takes a list of interactions and infers the underlying Interest DNA.
    Optionally accepts user_goal to factor goal-behavior alignment.
    """
    try:
        # Limit to the 6 most recent/relevant interactions
        interactions_to_analyze = request.interactions[:6]
        
        # Data Sufficiency check
        if len(interactions_to_analyze) < 3:
            raise HTTPException(
                status_code=400, 
                detail="Not enough evidence to infer a strong interest yet. Connect more content or interact with more technology content."
            )
        
        print(f"Starting bulk analysis for {len(interactions_to_analyze)} interactions... Goal: {request.user_goal.goal if request.user_goal else 'None'}")
        
        # Step 1: Bulk analyze interactions in one LLM call
        analyzed_interactions = await analyze_multiple_interactions(interactions_to_analyze)
        
        print("Bulk analysis complete. Inferring interest DNA...")
        
        # Step 2: Infer persistent interest DNA, factoring in the user's goal
        interest_profile = await infer_interest_dna(
            interactions_to_analyze, 
            analyzed_interactions,
            user_goal=request.user_goal
        )
        
        print("Interest DNA inference complete.")
        
        # Attach the video-level analysis so the frontend can display it
        interest_profile.analyzedContent = {ac.id: ac for ac in analyzed_interactions}
        
        return interest_profile
    except HTTPException:
        raise
    except Exception as e:
        print("Error during analysis:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
