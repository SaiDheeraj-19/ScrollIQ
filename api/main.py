from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import reels, analysis, recommendations, candidates, integrations

app = FastAPI(title="ScrollIQ API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reels.router, prefix="/api", tags=["reels"])
app.include_router(analysis.router, prefix="/api", tags=["analysis"])
app.include_router(recommendations.router, prefix="/api", tags=["recommendations"])
app.include_router(candidates.router, prefix="/api", tags=["candidates"])
app.include_router(integrations.router, prefix="/api/integrations", tags=["integrations"])

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "ScrollIQ Backend is running"}
