import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv
import traceback

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

async def get_structured_response(system_prompt: str, user_prompt: str, response_format: dict = None):
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
    
    if response_format:
        messages[0]["content"] += f"\n\nYou MUST return a valid JSON object adhering to this schema: {json.dumps(response_format)}. Do not include any markdown formatting like ```json."

    # Try Groq first
    if GROQ_API_KEY:
        print("Attempting Groq API...")
        try:
            groq_client = AsyncOpenAI(
                api_key=GROQ_API_KEY, 
                base_url="https://api.groq.com/openai/v1",
                timeout=20.0
            )
            response = await groq_client.chat.completions.create(
                model="llama-3.1-8b-instant", 
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.1,
                max_tokens=8000
            )
            print("Groq API succeeded.")
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Groq API failed: {e}. Falling back to OpenRouter...")

    # Fallback to OpenRouter
    if OPENROUTER_API_KEY:
        try:
            or_client = AsyncOpenAI(
                api_key=OPENROUTER_API_KEY, 
                base_url="https://openrouter.ai/api/v1",
                timeout=40.0
            )
            response = await or_client.chat.completions.create(
                model="meta-llama/llama-3.1-70b-instruct",
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.1,
                max_tokens=8000
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"OpenRouter API failed: {e}")
            raise e
            
    raise ValueError("Neither GROQ_API_KEY nor OPENROUTER_API_KEY worked.")

