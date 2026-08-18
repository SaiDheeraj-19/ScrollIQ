import os
import httpx
from typing import Optional
from models.schemas import RecommendedArticle

TAVILY_OPEN_URL = os.getenv("TAVILY_OPEN_URL", "http://localhost:3000")

async def search_deep_dive_article(direction: str, goal: Optional[str] = None) -> Optional[RecommendedArticle]:
    """
    Query tavily-open for a deep dive technical article matching the direction and goal.
    """
    # Construct a high-quality search query
    query_parts = [direction, "tutorial", "guide", "explained"]
    if goal:
        query_parts.append(goal)
        
    query = " ".join(query_parts)
    
    url = f"{TAVILY_OPEN_URL}/tavily/search"
    payload = {
        "query": query,
        "search_depth": "basic",
        "include_raw_content": False,
        "limit": 3
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=payload)
            
        if response.status_code == 200:
            data = response.json()
            results = data.get("results", [])
            
            if results:
                # Pick the first good result (could add more filtering here)
                best = results[0]
                return RecommendedArticle(
                    title=best.get("title", "Deep Dive Article"),
                    url=best.get("url", "#"),
                    content=best.get("content", "A comprehensive guide on this topic.")
                )
    except Exception as e:
        print(f"Tavily search failed for query '{query}': {e}")
        
    return None
