from models.schemas import UnifiedInteraction

def calculate_behavior_score(interaction: UnifiedInteraction) -> dict:
    """
    Phase 5: Behavior Engine.
    Translates raw interaction signals into a unified weight and evidence string.
    """
    beh = interaction.behavior
    score = 0.0
    evidence = []
    
    # Watch percentage/duration
    # In the dynamic feed, we pass watchPercent as duration in seconds for simplicity.
    watch_seconds = beh.watchPercent or 0.0
    
    if watch_seconds > 0 and watch_seconds < 10.0:
        # User swiped away quickly - strong negative signal (Not Interested)
        score -= 0.8
        evidence.append("Swiped away quickly (<10s)")
    elif watch_seconds >= 30.0:
        # User watched a substantial amount
        score += 0.5
        evidence.append("High watch time (>30s)")
    elif watch_seconds > 0 and watch_seconds < 30.0:
        score += 0.2
        evidence.append(f"Partial watch ({int(watch_seconds)}s)")
        
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
