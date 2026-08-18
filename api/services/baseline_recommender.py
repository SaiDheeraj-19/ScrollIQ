import random
from typing import List
from models.schemas import UnifiedInteraction, CandidateReel, RecommendationResponse

class BaselineRecommender:
    """
    A simple baseline recommender that matches keywords in candidate descriptions 
    against the raw surface topics extracted from the interaction history.
    This demonstrates the naive "Java -> More Java" trap.
    """
    
    def generate_recommendation(self, interactions: List[UnifiedInteraction], candidates: List[CandidateReel]) -> RecommendationResponse:
        # Extract keywords directly from the interactions without inferring deep interests
        interaction_keywords = set()
        for interaction in interactions:
            words = interaction.title.lower().split() + (interaction.description or "").lower().split()
            # Simple stopword removal (naive approach)
            stopwords = {"the", "a", "an", "and", "or", "but", "is", "are", "for", "to", "in", "of", "on", "how", "what", "with"}
            interaction_keywords.update([w.strip("#.,!?()") for w in words if w not in stopwords and len(w) > 3])
            
        best_candidate = None
        max_overlap = -1
        
        for candidate in candidates:
            cand_words = set([w.strip("#.,!?()").lower() for w in (candidate.title + " " + candidate.description).split()])
            overlap = len(interaction_keywords.intersection(cand_words))
            
            if overlap > max_overlap:
                max_overlap = overlap
                best_candidate = candidate
                
        if not best_candidate and candidates:
            best_candidate = candidates[0]
            
        # The explanation reflects the naive keyword matching
        matched_words = list(interaction_keywords.intersection(set([w.strip("#.,!?()").lower() for w in (best_candidate.title + " " + best_candidate.description).split()]))) if best_candidate else []
        
        return RecommendationResponse(
            currentReel="Last Video",
            interestDetected="Keyword Match",
            why=f"Because you watched videos mentioning: {', '.join(matched_words[:3])}.",
            recommendedTechReel=best_candidate.title if best_candidate else "Generic Video",
            category=best_candidate.category if best_candidate else "Unknown",
            whyRecommendation="Baseline keyword frequency match.",
            difficulty=best_candidate.difficulty if best_candidate else "Beginner",
            confidence="Low",
            candidateId=best_candidate.id if best_candidate else "",
            videoId=best_candidate.videoId if best_candidate else None
        )
