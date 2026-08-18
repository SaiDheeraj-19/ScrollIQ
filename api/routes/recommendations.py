import json
import os
from fastapi import APIRouter, HTTPException
from models.schemas import RecommendRequest, RecommendationResponse, FeedbackRequest, CandidateReel, UserGoal
from services.recommendation_engine import (
    rank_candidates_and_recommend, 
    generate_recommendation_directions,
    calculate_goal_alignment
)
from services.baseline_recommender import BaselineRecommender
from services.tavily_service import search_deep_dive_article
import asyncio

router = APIRouter()
baseline_engine = BaselineRecommender()

@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendation(request: RecommendRequest):
    try:
        user_goal: UserGoal | None = request.user_goal
        
        # 1. Generate adjacent learning directions (factoring in the user goal)
        directions = await generate_recommendation_directions(
            request.profile, 
            request.recent_interactions,
            user_goal=user_goal
        )
        target_direction = directions[0] if directions else request.profile.primaryInterest.name
        
        # 2. Calculate goal alignment
        goal_alignment = await calculate_goal_alignment(
            user_goal,
            request.profile.primaryInterest.name,
            target_direction
        )
        
        print(f"Direction: {target_direction} | Goal Alignment: {goal_alignment.label} ({goal_alignment.score:.2f})")
        
        candidates = []
        if request.providerToken:
            import httpx
            import random
            try:
                # Search YouTube using the direction + goal keywords for better candidates
                search_query = target_direction
                if user_goal and user_goal.goal:
                    search_query = f"{target_direction} {user_goal.goal}"
                    
                url = "https://www.googleapis.com/youtube/v3/search"
                params = {
                    "part": "snippet",
                    "q": f"{search_query} tutorial explained",
                    "type": "video",
                    "videoDuration": "short",
                    "maxResults": 10,
                    "relevanceLanguage": "en"
                }
                headers = {
                    "Authorization": f"Bearer {request.providerToken}",
                    "Accept": "application/json"
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.get(url, params=params, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    for item in data.get("items", []):
                        snippet = item.get("snippet", {})
                        video_id = item.get("id", {}).get("videoId")
                        if not video_id:
                            continue
                        candidates.append(CandidateReel(
                            id=f"yt_search_{video_id}",
                            videoId=video_id,
                            title=snippet.get("title", ""),
                            description=snippet.get("description", ""),
                            channel=snippet.get("channelTitle", ""),
                            url=f"https://youtube.com/shorts/{video_id}",
                            category=target_direction,
                            difficulty=random.choice(["Beginner", "Intermediate", "Advanced"]),
                            educationalValue=round(random.uniform(0.6, 1.0), 2),
                            hypeScore=round(random.uniform(0.1, 0.5), 2)
                        ))
                else:
                    print(f"YouTube search failed ({response.status_code}): {response.text[:200]}")
            except Exception as search_err:
                print(f"Failed to fetch dynamic candidates: {search_err}")
                
        # Fallback to curated candidates if no token or search failed
        if not candidates:
            file_path = os.path.join(os.path.dirname(__file__), "../data/candidates.json")
            with open(file_path, 'r') as f:
                data = json.load(f)
            candidates = [CandidateReel(**item) for item in data]
            
        if not candidates:
            raise HTTPException(status_code=500, detail="No candidates available")
            
        # 3. Rank candidates and fetch Deep Dive Article concurrently
        recommendation_task = rank_candidates_and_recommend(
            request.profile, 
            candidates, 
            request.recent_interactions, 
            target_direction,
            user_goal=user_goal,
            goal_alignment=goal_alignment
        )
        
        article_task = search_deep_dive_article(target_direction, user_goal.goal if user_goal else None)
        
        recommendation, article = await asyncio.gather(recommendation_task, article_task)
        
        # Attach the article
        recommendation.recommendedArticle = article
        
        # 4. Get Baseline (naive keyword) recommendation for comparison
        baseline_rec = baseline_engine.generate_recommendation(request.recent_interactions, candidates)
        recommendation.baseline = baseline_rec
        
        return recommendation
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    """Record user feedback on a recommendation."""
    print(f"Feedback received for rec_id={request.recommendationId}: {request.action}")
    return {"status": "success", "message": "Feedback recorded."}
