from models.schemas import UnifiedInteraction

def calculate_behavior_score(interaction: UnifiedInteraction) -> dict:
    """
    Phase 5: Behavior Engine.
    Translates raw interaction signals into a unified weight and evidence string.
    """
    beh = interaction.behavior
    score = 0.0
    evidence = []
    
    # Watch percentage is a strong baseline (0.0 to 1.0)
    score += (beh.watchPercent or 0.0) * 0.4
    
    if beh.watchPercent and beh.watchPercent > 0.8:
        evidence.append(f"High watch time ({int(beh.watchPercent * 100)}%)")
        
    if beh.liked:
        score += 0.2
        evidence.append("Liked")
        
    if beh.saved:
        score += 0.3
        evidence.append("Saved for later")
        
    if beh.shared:
        score += 0.2
        evidence.append("Shared with others")
        
    if beh.rewatched:
        score += 0.1
        evidence.append("Rewatched")
        
    if beh.skipped:
        score -= 0.5
        evidence.append("Skipped")
        
    # Cap score at 1.0, lower bound at 0.0
    final_score = max(0.0, min(1.0, score))
    
    weight = "Weak"
    if final_score > 0.7:
        weight = "Strong"
    elif final_score > 0.4:
        weight = "Medium"
        
    return {
        "score": final_score,
        "weight": weight,
        "evidence_string": ", ".join(evidence) if evidence else "Passive watch"
    }
