from models.schemas import CandidateReel, InterestProfile

def explain_recommendation(candidate: CandidateReel, profile: InterestProfile) -> str:
    """
    Phase 10: Explanation Engine.
    Generates human-readable explanations bridging the DNA to the recommendation.
    """
    return f"Based on your strong interest in {profile.primaryInterest.name}, this {candidate.difficulty.lower()} level {candidate.category} content provides high educational value without the fluff."

def explain_rejection(candidate: CandidateReel) -> str:
    """
    Explains why a candidate was caught by the anti-hype filter.
    """
    if candidate.hypeScore > 0.7:
        return f"Rejected '{candidate.title}' because it had a high clickbait/hype score ({candidate.hypeScore:.2f}) and low actual educational value."
    return f"Rejected '{candidate.title}' because it wasn't the best match for your inferred interests."
