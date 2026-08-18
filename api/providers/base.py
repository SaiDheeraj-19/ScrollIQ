from abc import ABC, abstractmethod
from typing import List
from models.schemas import UnifiedInteraction

class ContentProvider(ABC):
    @abstractmethod
    async def get_interactions(self) -> List[UnifiedInteraction]:
        """Fetch and normalize interactions from the provider source."""
        pass
