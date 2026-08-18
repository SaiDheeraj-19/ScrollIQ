from models.schemas import CandidateReel
from typing import Tuple

def evaluate_quality(candidate: CandidateReel) -> Tuple[float, bool]:
    """
    Phase 9: Quality/Anti-Hype Engine.
    Calculates a base quality score and flags if it should be strictly rejected for hype.
    Returns: (quality_score (0-1), is_rejected)
    """
    # High hype and low ed value is a rejection
    if candidate.hypeScore > 0.7 and candidate.educationalValue < 0.4:
        return (0.0, True)
        
    # High ed value gets a boost, hype gets a penalty
    base_score = candidate.educationalValue * 0.7 + (1.0 - candidate.hypeScore) * 0.3
    
    # Cap between 0 and 1
    final_score = max(0.0, min(1.0, base_score))
    return (final_score, False)
