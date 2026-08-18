from typing import List
from models.schemas import UnifiedInteraction, AnalyzedContent
from services.ai_service import get_structured_response
import asyncio

async def analyze_multiple_interactions(interactions: List[UnifiedInteraction]) -> List[AnalyzedContent]:
    """
    Phase 4: Content Analysis Engine (Optimized Bulk Analysis).
    Analyzes all interactions in a single LLM call to save time and API costs.
    """
    if not interactions:
        return []

    system_prompt = """
    You are an expert AI content analyst. 
    Analyze the given list of short-form video metadata. For each video, infer its underlying topic, broader domain, context, apparent intent, technical level (e.g., Beginner, Intermediate, Advanced), educational value (0.0 to 1.0), and hype score (0.0 to 1.0).
    Provide semantic tags.
    IMPORTANT: You must return the analysis in the exact same order as the input list.
    """
    
    user_prompt = "VIDEOS TO ANALYZE:\n\n"
    for idx, interaction in enumerate(interactions):
        safe_desc = (interaction.description or '')[:300]
        user_prompt += f"VIDEO [{idx}]:\nID: {interaction.id}\nTitle: {interaction.title}\nDescription: {safe_desc}\nCategory: {interaction.category or ''}\n\n"
    
    schema = {
        "results": [
            {
                "id": "string",
                "topic": "string",
                "broaderDomain": "string",
                "context": "string",
                "apparentIntent": "string",
                "technicalLevel": "string",
                "educationalValue": 0.0,
                "hypeScore": 0.0,
                "semanticTags": ["string"]
            }
        ]
    }
    
    response = await get_structured_response(system_prompt, user_prompt, response_format=schema)
    
    # Handle cases where the LLM ignores the outer object and just returns the array directly
    results = []
    if isinstance(response, list):
        results = response
    elif isinstance(response, dict):
        results = response.get("results", [])
    
    analyzed_list = []
    # Map back to AnalyzedContent objects, ensuring we match IDs or just use the results safely
    result_map = {str(r.get("id")): r for r in results}
    
    for interaction in interactions:
        r = result_map.get(interaction.id, {})
        analyzed_list.append(
            AnalyzedContent(
                id=interaction.id,
                topic=r.get("topic", "Unknown"),
                broaderDomain=r.get("broaderDomain", "Unknown"),
                context=r.get("context", "Unknown"),
                apparentIntent=r.get("apparentIntent", "Unknown"),
                technicalLevel=r.get("technicalLevel", "Unknown"),
                educationalValue=r.get("educationalValue", 0.0),
                hypeScore=r.get("hypeScore", 0.0),
                semanticTags=r.get("semanticTags", [])
            )
        )
        
    return analyzed_list
