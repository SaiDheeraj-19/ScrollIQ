from typing import List
from providers.base import ContentProvider
from models.schemas import UnifiedInteraction

class InstagramProvider(ContentProvider):
    async def get_interactions(self) -> List[UnifiedInteraction]:
        """
        Mock implementation for Instagram integration.
        In a real scenario, this would use the official Instagram Basic Display API.
        For the hackathon demo, we return an empty list or gracefully fail if unauthorized,
        falling back to the DemoProvider.
        """
        # TODO: Implement actual Instagram API integration
        return []
