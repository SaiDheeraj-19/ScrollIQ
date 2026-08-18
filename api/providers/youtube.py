import httpx
from typing import List, Optional
from providers.base import ContentProvider
from models.schemas import UnifiedInteraction, BehaviorSignals, Creator

class YouTubeProvider(ContentProvider):
    def __init__(self, access_token: Optional[str] = None):
        self.access_token = access_token

    async def get_interactions(self) -> List[UnifiedInteraction]:
        if not self.access_token:
            print("No YouTube access token provided. Returning empty list.")
            return []
            
        url = "https://www.googleapis.com/youtube/v3/videos"
        params = {
            "myRating": "like",
            "part": "snippet,contentDetails,statistics",
            "maxResults": 10
        }
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Accept": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=headers)
            
        if response.status_code != 200:
            print(f"Failed to fetch YouTube data: {response.text}")
            return []
            
        data = response.json()
        interactions = []
        
        for item in data.get("items", []):
            snippet = item.get("snippet", {})
            stats = item.get("statistics", {})
            
            # Create the interaction object
            interaction = UnifiedInteraction(
                id=f"yt_{item['id']}",
                source="youtube",
                contentType="video",
                contentId=item["id"],
                title=snippet.get("title", ""),
                description=snippet.get("description", ""),
                thumbnailUrl=snippet.get("thumbnails", {}).get("high", {}).get("url"),
                contentUrl=f"https://www.youtube.com/watch?v={item['id']}",
                creator=Creator(
                    id=snippet.get("channelId"),
                    name=snippet.get("channelTitle")
                ),
                publishedAt=snippet.get("publishedAt"),
                behavior=BehaviorSignals(
                    liked=True, # It's from their liked videos
                    saved=False,
                    shared=False,
                    rewatched=False,
                    skipped=False,
                    watchPercent=0.8 # Assume watched heavily if liked
                )
            )
            interactions.append(interaction)
            
        return interactions
