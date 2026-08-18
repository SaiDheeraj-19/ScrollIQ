from fastapi import APIRouter, Query, HTTPException
import json
import os
from typing import List, Optional
from models.schemas import UnifiedInteraction
from providers.demo import DemoProvider
from providers.youtube import YouTubeProvider

router = APIRouter()
demo_provider = DemoProvider()
youtube_provider = YouTubeProvider()

@router.get("/reels", response_model=List[UnifiedInteraction])
async def get_reels(
    provider: str = Query("demo", description="The provider to fetch reels from (e.g. demo, youtube)"),
    token: Optional[str] = Query(None, description="OAuth token for the provider (if required)"),
    dataset: str = Query("a", description="The demo dataset to load (a, b, or c)")
):
    """
    Fetch interactions (watch history) from the specified provider.
    For 'demo', it loads the local JSON dataset specified by 'dataset' (a=Trap, b=Data, c=Cloud).
    For 'youtube', it requires a valid OAuth token.
    """
    try:
        if provider == "youtube":
            if not token:
                raise HTTPException(status_code=401, detail="YouTube provider requires a token")
            yt_provider = YouTubeProvider(access_token=token)
            return await yt_provider.get_interactions()
            
        elif provider == "demo":
            # Load the requested dataset
            file_name = "reels.json" # default (Dataset A - Trap)
            if dataset == "b":
                file_name = "dataset_b_data.json"
            elif dataset == "c":
                file_name = "dataset_c_cloud.json"
                
            file_path = os.path.join(os.path.dirname(__file__), f"../data/{file_name}")
            with open(file_path, 'r') as f:
                data = json.load(f)
            return [UnifiedInteraction(**item) for item in data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
