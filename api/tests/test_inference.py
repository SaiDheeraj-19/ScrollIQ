import pytest
import json
import os
from models.schemas import UnifiedInteraction
from services.content_analyzer import analyze_multiple_interactions
from services.interest_engine import infer_interest_dna

# We use asyncio for async tests
pytestmark = pytest.mark.asyncio

# Helper to load a local dataset
def load_dataset(filename: str):
    file_path = os.path.join(os.path.dirname(__file__), f"../data/{filename}")
    with open(file_path, 'r') as f:
        data = json.load(f)
    return [UnifiedInteraction(**item) for item in data]

async def test_trap_dataset_infers_software_engineering():
    """
    TEST 1 — OFFICIAL TRAP
    Input: Java meme, Developer lifestyle, Coding interview, Laptop comparison
    Expected: primary_interest should be 'Software Engineering', NOT just 'Java'.
    """
    interactions = load_dataset("reels.json")
    
    analyzed_interactions = await analyze_multiple_interactions(interactions)
    profile = await infer_interest_dna(interactions, analyzed_interactions)
    
    # Assert it escaped the trap
    primary = profile.primaryInterest.name.lower()
    
    assert "java" not in primary, f"Trap failed: AI fell for the Java keyword trap. Returned: {primary}"
    assert "software engineering" in primary or "programming" in primary or "developer" in primary, f"Failed to infer broader domain. Returned: {primary}"

async def test_data_analytics_dataset():
    """
    TEST 2 — DATA ANALYTICS
    Input: Python, Pandas, SQL, Data visualization, Power BI
    Expected: Data Analytics / Data Science-related interest.
    """
    interactions = load_dataset("dataset_b_data.json")
    
    analyzed_interactions = await analyze_multiple_interactions(interactions)
    profile = await infer_interest_dna(interactions, analyzed_interactions)
    
    primary = profile.primaryInterest.name.lower()
    assert "data" in primary or "analytics" in primary, f"Failed to infer Data Analytics. Returned: {primary}"

async def test_cloud_devops_dataset():
    """
    TEST 3 — CLOUD DEVOPS
    Input: AWS, Docker, Kubernetes, Terraform
    Expected: Cloud / DevOps
    """
    interactions = load_dataset("dataset_c_cloud.json")
    
    analyzed_interactions = await analyze_multiple_interactions(interactions)
    profile = await infer_interest_dna(interactions, analyzed_interactions)
    
    primary = profile.primaryInterest.name.lower()
    assert "cloud" in primary or "devops" in primary or "infrastructure" in primary, f"Failed to infer Cloud/DevOps. Returned: {primary}"
