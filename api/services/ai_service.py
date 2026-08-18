import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv
import traceback

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

import asyncio

async def get_structured_response(system_prompt: str, user_prompt: str, response_format: dict = None):
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
    
    if response_format:
        messages[0]["content"] += f"\n\nYou MUST return a valid JSON object adhering to this schema: {json.dumps(response_format)}. Do not include any markdown formatting like ```json."

    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")

    groq_client = AsyncOpenAI(
        api_key=GROQ_API_KEY, 
        base_url="https://api.groq.com/openai/v1",
        timeout=40.0
    )

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = await groq_client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.1,
                max_tokens=2000
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            err_str = str(e).lower()
            if "rate_limit_exceeded" in err_str or "429" in err_str:
                if attempt < max_retries - 1:
                    sleep_time = 14
                    print(f"Rate limit hit, sleeping for {sleep_time}s...")
                    await asyncio.sleep(sleep_time)
                    continue
            print(f"Groq API failed: {e}")
            raise e

