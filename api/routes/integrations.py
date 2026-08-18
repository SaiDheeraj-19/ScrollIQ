from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
import os
import httpx
from urllib.parse import urlencode

router = APIRouter()

YOUTUBE_CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
YOUTUBE_CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")
YOUTUBE_REDIRECT_URI = os.getenv("YOUTUBE_REDIRECT_URI")

# We request readonly access to YouTube to fetch liked videos
YOUTUBE_SCOPES = "https://www.googleapis.com/auth/youtube.readonly"

@router.get("/youtube/login")
async def youtube_login():
    """Redirects the user to Google's OAuth 2.0 consent screen."""
    if not YOUTUBE_CLIENT_ID or not YOUTUBE_REDIRECT_URI:
        return {"error": "YouTube credentials not configured in .env"}
        
    params = {
        "client_id": YOUTUBE_CLIENT_ID,
        "redirect_uri": YOUTUBE_REDIRECT_URI,
        "response_type": "code",
        "scope": YOUTUBE_SCOPES,
        "access_type": "offline",
        "prompt": "consent"
    }
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return RedirectResponse(auth_url)

@router.get("/youtube/callback")
async def youtube_callback(code: str):
    """Exchanges the authorization code for an access token and redirects to frontend."""
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": YOUTUBE_CLIENT_ID,
        "client_secret": YOUTUBE_CLIENT_SECRET,
        "redirect_uri": YOUTUBE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data)
        
    if response.status_code != 200:
        return {"error": "Failed to fetch token", "details": response.json()}
        
    token_data = response.json()
    access_token = token_data.get("access_token")
    
    # Redirect back to the frontend onboarding flow with the access token
    frontend_url = f"http://localhost:3000/onboarding?youtube_token={access_token}"
    return RedirectResponse(frontend_url)
