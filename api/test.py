import os, json, urllib.request
from dotenv import load_dotenv
load_dotenv(".env")
req = urllib.request.Request("https://api.groq.com/openai/v1/models", headers={"Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}"})
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())
    print([m["id"] for m in data.get("data", [])])
