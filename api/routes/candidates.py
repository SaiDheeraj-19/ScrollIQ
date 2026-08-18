from fastapi import APIRouter
import json
from typing import List
from models.schemas import CandidateReel

router = APIRouter()

def load_candidates():
    with open("data/candidates.json", "r") as f:
        return json.load(f)

@router.get("/candidates", response_model=List[CandidateReel])
async def get_candidates():
    """Returns the candidate technology reels"""
    return load_candidates()
