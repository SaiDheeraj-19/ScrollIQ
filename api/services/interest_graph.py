from models.schemas import InterestProfile

def build_interest_graph(profile: InterestProfile) -> dict:
    """
    Phase 7: Interest Graph.
    Generates a lightweight conceptual hierarchy returned as structured JSON.
    """
    # Root node is the primary interest
    graph = {
        "id": "root",
        "name": profile.primaryInterest.name,
        "confidence": profile.primaryInterest.confidence,
        "score": profile.primaryInterest.score,
        "children": []
    }
    
    # Children are the supporting interests
    for supp in profile.supportingInterests:
        graph["children"].append({
            "id": supp.name.lower().replace(" ", "_"),
            "name": supp.name,
            "score": supp.score,
            "evidence": supp.evidence
        })
        
    return graph
