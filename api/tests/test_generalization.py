import pytest
import asyncio
from models.schemas import UnifiedInteraction, BehaviorSignals
from services.interest_engine import infer_interest_dna
from services.content_analyzer import analyze_multiple_interactions

def create_mock_interaction(idx, title, category):
    return UnifiedInteraction(
        id=f"mock_{idx}",
        source="demo",
        contentType="video",
        contentId=f"vid_{idx}",
        title=title,
        category=category,
        behavior=BehaviorSignals(liked=True, watchPercent=0.9)
    )

@pytest.mark.asyncio
async def test_fixture_a_software_engineering():
    """Java, Developer, Interview, Laptop -> Software Engineering"""
    interactions = [
        create_mock_interaction(1, "Why Java is still king", "Java"),
        create_mock_interaction(2, "Day in the life of a Developer", "Career"),
        create_mock_interaction(3, "How to pass your coding interview", "Interview"),
        create_mock_interaction(4, "M3 Macbook Pro Review for Coding", "Hardware")
    ]
    analyzed = await analyze_multiple_interactions(interactions)
    dna = await infer_interest_dna(interactions, analyzed)
    
    assert "software" in dna.primaryInterest.name.lower() or "engineering" in dna.primaryInterest.name.lower()
    
@pytest.mark.asyncio
async def test_fixture_b_data_analytics():
    """Python, SQL, Pandas, Power BI -> Data Analytics"""
    interactions = [
        create_mock_interaction(1, "Python for beginners", "Python"),
        create_mock_interaction(2, "Advanced SQL Joins", "SQL"),
        create_mock_interaction(3, "Pandas data cleaning", "Pandas"),
        create_mock_interaction(4, "Power BI Dashboard Tutorial", "Tools")
    ]
    analyzed = await analyze_multiple_interactions(interactions)
    dna = await infer_interest_dna(interactions, analyzed)
    
    assert "data" in dna.primaryInterest.name.lower() or "analytics" in dna.primaryInterest.name.lower()

@pytest.mark.asyncio
async def test_fixture_c_cloud_devops():
    """AWS, Docker, Kubernetes, CI/CD -> Cloud / DevOps"""
    interactions = [
        create_mock_interaction(1, "AWS EC2 Setup", "AWS"),
        create_mock_interaction(2, "Docker containers explained", "Docker"),
        create_mock_interaction(3, "Kubernetes Architecture", "Kubernetes"),
        create_mock_interaction(4, "GitHub Actions CI/CD Pipeline", "CI/CD")
    ]
    analyzed = await analyze_multiple_interactions(interactions)
    dna = await infer_interest_dna(interactions, analyzed)
    
    assert "cloud" in dna.primaryInterest.name.lower() or "devops" in dna.primaryInterest.name.lower()

@pytest.mark.asyncio
async def test_fixture_d_frontend_engineering():
    """React, Next.js, TypeScript, Frontend Architecture -> Frontend Engineering"""
    interactions = [
        create_mock_interaction(1, "React Hooks Tutorial", "React"),
        create_mock_interaction(2, "Next.js App Router", "Next.js"),
        create_mock_interaction(3, "TypeScript Generics", "TypeScript"),
        create_mock_interaction(4, "Frontend Architecture Patterns", "Architecture")
    ]
    analyzed = await analyze_multiple_interactions(interactions)
    dna = await infer_interest_dna(interactions, analyzed)
    
    assert "frontend" in dna.primaryInterest.name.lower() or "web" in dna.primaryInterest.name.lower()

@pytest.mark.asyncio
async def test_fixture_e_mixed_interests():
    """Mixed unrelated interests -> lower confidence / multiple interests"""
    interactions = [
        create_mock_interaction(1, "Making the perfect espresso", "Coffee"),
        create_mock_interaction(2, "Top 10 RPG Games 2024", "Gaming"),
        create_mock_interaction(3, "React Hooks Tutorial", "React"),
        create_mock_interaction(4, "How to fix a leaky sink", "DIY")
    ]
    analyzed = await analyze_multiple_interactions(interactions)
    dna = await infer_interest_dna(interactions, analyzed)
    
    assert dna.primaryInterest.confidence.lower() in ["low", "medium"]
