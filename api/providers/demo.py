from typing import List
import json
import os
from providers.base import ContentProvider
from models.schemas import UnifiedInteraction

class DemoProvider(ContentProvider):
    async def get_interactions(self) -> List[UnifiedInteraction]:
        data_path = os.path.join(os.path.dirname(__file__), "..", "data", "reels.json")
        with open(data_path, "r") as f:
            data = json.load(f)
        
        # Pydantic validation handles parsing
        return [UnifiedInteraction(**item) for item in data]
