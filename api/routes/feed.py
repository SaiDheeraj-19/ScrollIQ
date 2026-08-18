from fastapi import APIRouter, HTTPException, Header
from typing import List, Optional
from providers.youtube import YouTubeProvider
from models.schemas import CandidateReel
import json

router = APIRouter()

def load_fallback_candidates():
    with open("data/candidates.json", "r") as f:
        return json.load(f)

@router.get("/feed/youtube", response_model=List[CandidateReel])
async def get_dynamic_youtube_feed(
    query: str, 
    authorization: Optional[str] = Header(None)
):
    """
    Fetches dynamic shorts from YouTube if a token is provided.
    Falls back to curated candidates if no token or API fails.
    """
    if not authorization or not authorization.startswith("Bearer "):
        print("No YouTube token, using fallback candidates.")
        return load_fallback_candidates()
        
    token = authorization.replace("Bearer ", "")
    provider = YouTubeProvider(access_token=token)
    
    shorts = await provider.search_shorts(query=f"{query} programming short", max_results=10)
    
    if not shorts:
        print("YouTube search returned empty, using fallback.")
        return load_fallback_candidates()
        
    candidates = []
    for short in shorts:
        candidates.append(CandidateReel(
            id=f"dyn_{short['videoId']}",
            videoId=short['videoId'],
            title=short['title'],
            description="Dynamic YouTube result",
            category=query,
            channel=short['channelTitle'],
            educationalValue=0.5, # Default generic value
            hypeScore=0.1
        ))
        
    return candidates
