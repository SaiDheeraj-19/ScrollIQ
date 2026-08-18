<div align="center">

<br/>

# 🧠 ScrollIQ

### *Every algorithm knows what you watched. ScrollIQ tries to understand what you are becoming.*

<br/>

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Llama 3](https://img.shields.io/badge/Llama_3.1-Meta_AI-blue?style=for-the-badge)](https://llama.meta.com)

<br/>

> **Built for the "The Algorithm Knows You Too Well" Hackathon**

<br/>

</div>

---

## What is ScrollIQ?

Students spend hours scrolling short-form content. Most recommendation engines optimize for **engagement** — serving more of what you already watched to keep you hooked.

ScrollIQ does the opposite.

It takes what you interact with, understands what it *means*, combines it with your stated career goal, and recommends the single most valuable tech educational content for your next learning step.

```
WHAT YOU WATCH  +  WHAT YOU WANT  +  WHAT YOUR BEHAVIOR REVEALS
                           ↓
              WHAT YOU SHOULD WATCH NEXT
```

---

## The Core Problem ScrollIQ Solves

A shallow recommendation system sees:

```
Java meme → Java lifestyle → Coding interview joke → Laptop review
                    ↓
           Recommend: Another Java video ❌
```

ScrollIQ infers:

```
Java meme + Developer lifestyle + Coding interview + Hardware
                    ↓
         Surface Topics: Java, Career, Hardware
                    ↓
        Latent Interest: Software Engineering ✅
                    ↓
    Next Direction: System Design / Backend Architecture
                    ↓
     Watch This: "Designing a Scalable REST API" [Real YouTube Short]
```

---

## Key Features

### 🎯 Explicit User Goal
Set your career goal during onboarding. ScrollIQ factors it into every recommendation — and tells you if your behavior contradicts it.

### 🔬 Two-Stage AI Inference
- **Stage 1** — Content Analysis: Each interaction is semantically analyzed for topic, intent, domain, technical level, educational value, and hype score.
- **Stage 2** — Latent Interest Engine: All interactions are analyzed *together* to infer the underlying persistent interest (not just the most common keyword).

### 📐 5-Factor Weighted Ranking
Every YouTube candidate is scored deterministically — no arbitrary LLM choices:

| Factor | Weight |
|:---|:---:|
| Interest Match | 25% |
| Goal Alignment | 25% |
| Latent Interest Match | 15% |
| Context Match | 15% |
| Educational Value | 20% |

### 🚫 Anti-Hype Engine
Candidates like *"10 AI Tools That Will Get You A Job"* are automatically penalized for exaggerated claims and low educational substance. The system shows you **why** a video was rejected.

### 🔁 Goal ↔ Interest Alignment
ScrollIQ detects when your stated goal and your observed behavior diverge — and explains the mismatch instead of silently ignoring it.

### 📺 Real YouTube Integration
Full OAuth 2.0 with the YouTube Data API. Liked videos are imported. Recommendations are dynamically searched using the AI-generated learning direction + your goal.

### 📊 Interactive Dashboard
- Surface Topics vs. Latent Interest visualization
- Interest Radar Chart (recharts)
- AI Reasoning Engine evidence panel
- Goal Alignment badge (High / Medium / Low / Mismatch)
- Official Hackathon Output Contract terminal
- Recent ScrollIQ activity feed (first-party events)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      SCROLLIQ v2                         │
├─────────────────┬───────────────────────────────────────┤
│   Data Sources  │  YouTube OAuth · Demo Datasets · ScrollIQ Events
│                 │                                         │
│   Content       │  Bulk semantic analysis per interaction │
│   Analyzer      │  topic · domain · intent · hype score  │
│                 │                                         │
│   Behavior      │  Signal weighting: liked > saved > watched
│   Engine        │  Unavailable fields remain null        │
│                 │                                         │
│   Latent        │  Cross-reel inference (NOT per-reel)   │
│   Interest      │  surface_topics → latent_interest       │
│   Engine        │  evidence · contradictions · reasoning  │
│                 │                                         │
│   Goal          │  Semantic comparison of stated goal     │
│   Alignment     │  vs inferred interest via LLM          │
│                 │                                         │
│   Directions    │  3 adjacent learning paths generated    │
│   Engine        │  to avoid echo-chamber repetition      │
│                 │                                         │
│   Ranking       │  Deterministic 5-factor scoring        │
│   Engine        │  + Anti-Hype penalty                   │
│                 │                                         │
│   Output        │  Official hackathon contract JSON +    │
│                 │  Judge Output Terminal UI               │
└─────────────────┴───────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | Next.js 14, React, TypeScript, Framer Motion, Recharts |
| Backend | FastAPI, Python 3.14, Pydantic v2, AsyncIO |
| AI Engine | Llama 3.1 8B (Groq) → Llama 3.1 70B (OpenRouter fallback) |
| Integrations | YouTube Data API v3, OAuth 2.0 |
| Styling | Tailwind CSS, Lucide Icons |

---

## Project Structure

```
ScrollIQ/
├── api/                          # FastAPI Backend
│   ├── models/
│   │   └── schemas.py            # Pydantic models (all types)
│   ├── routes/
│   │   ├── analysis.py           # POST /api/analyze
│   │   ├── recommendations.py    # POST /api/recommend
│   │   ├── reels.py              # GET /api/reels
│   │   └── integrations.py      # YouTube OAuth
│   ├── services/
│   │   ├── ai_service.py         # Groq/OpenRouter LLM client
│   │   ├── content_analyzer.py   # Semantic content analysis
│   │   ├── behavior_engine.py    # Signal weighting
│   │   ├── interest_engine.py    # Latent interest inference
│   │   ├── recommendation_engine.py  # 5-factor ranking + goal alignment
│   │   ├── baseline_recommender.py   # Shallow keyword baseline (comparison)
│   │   └── quality_engine.py     # Hype detection
│   ├── data/
│   │   ├── reels.json            # Demo dataset A (Java/Trap)
│   │   ├── dataset_b_data.json   # Demo dataset B (Data Analytics)
│   │   ├── dataset_c_cloud.json  # Demo dataset C (Cloud/DevOps)
│   │   └── candidates.json       # Curated fallback candidates
│   ├── tests/
│   │   └── test_generalization.py  # 5-domain generalization tests
│   ├── .env.example              # Required environment variables
│   └── main.py                   # App entry point
│
└── web/                          # Next.js Frontend
    └── src/
        ├── app/
        │   ├── page.tsx           # Landing page
        │   ├── onboarding/        # Goal + platform setup
        │   └── app/
        │       ├── page.tsx       # Main dashboard
        │       ├── watch/         # Watch feed + activity tracking
        │       └── settings/      # User settings
        ├── components/
        │   ├── InterestDNA.tsx    # DNA panel (surface vs latent)
        │   ├── InterestRadar.tsx  # Radar chart visualization
        │   ├── RecommendationCard.tsx  # Smart rec card (injected in feed)
        │   ├── JudgeOutput.tsx    # Official output contract terminal
        │   └── ReelCard.tsx       # Individual interaction card
        ├── lib/api.ts             # API client + activity tracking
        └── types/index.ts         # Full TypeScript type definitions
```

---

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- A [Groq API key](https://console.groq.com) (free tier works)
- A [Google Cloud OAuth 2.0 client](https://console.cloud.google.com) (for YouTube)

### 1. Clone the repo

```bash
git clone https://github.com/SaiDheeraj-19/ScrollIQ.git
cd ScrollIQ
```

### 2. Set up the Backend

```bash
cd api

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn openai httpx python-dotenv pydantic pytest pytest-asyncio

# Configure your environment
cp .env.example .env
# Edit .env and fill in your API keys
```

### 3. Set up the Frontend

```bash
cd web
npm install
```

### 4. Configure Environment Variables

Edit `api/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here   # Optional fallback

YOUTUBE_CLIENT_ID=your_youtube_oauth_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_oauth_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:8000/api/integrations/youtube/callback
```

### 5. Run

In terminal 1 (backend):
```bash
cd api
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

In terminal 2 (frontend):
```bash
cd web
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Demo Flow

1. **Set Your Goal** — Select from 8 preset career goals or write your own (e.g., *"I want to become an AI engineer and learn LLMs"*).
2. **Connect YouTube** — Authorize with OAuth to import your liked videos. Or choose a demo dataset (A: Java Trap, B: Data Analytics, C: Cloud/DevOps).
3. **Analyze** — Click *"Analyze My Interests"*. ScrollIQ runs the full 2-stage AI pipeline.
4. **Watch the Reveal** — See Surface Topics vs. the inferred Latent Interest. Check Goal ↔ Interest alignment.
5. **Get Your Recommendation** — A real YouTube Short is injected directly into your feed, with full reasoning, score breakdown, and a rejected alternative (Why Not).
6. **Watch & Repeat** — Visit the Watch Feed. The activity is recorded as first-party data and feeds back into future recommendations.

---

## Running Tests

```bash
cd api
source venv/bin/activate
pytest tests/test_generalization.py -v
```

The test suite verifies that the AI correctly infers the right latent interest across 5 domains without being hardcoded:

| Test | Input | Expected Latent Interest |
|:---|:---|:---|
| A | Java meme, lifestyle, interview, laptop | Software Engineering |
| B | Python, SQL, Pandas, Power BI | Data Analytics |
| C | AWS, Docker, Kubernetes, CI/CD | Cloud / DevOps |
| D | React, Next.js, TypeScript, Frontend | Frontend Engineering |
| E | AI goal + Python, LLMs, RAG, GPU | AI / ML Engineering |

---

## Official Hackathon Output Contract

ScrollIQ returns a complete, structured output contract on every recommendation:

```json
{
  "current_reel": { "id": "...", "title": "..." },
  "user_goal": { "goal": "AI Engineer", "description": "..." },
  "surface_topics": ["Python", "LLMs", "GPU", "Coding"],
  "interest_detected": { "topic": "AI / ML Engineering", "confidence": "High" },
  "why": "...",
  "goal_alignment": { "score": 0.92, "label": "High", "reason": "..." },
  "recommendation_direction": "LLM Engineering / RAG Systems",
  "recommended_tech_reel": { "title": "...", "channel": "...", "url": "..." },
  "category": "AI",
  "why_this_recommendation": "...",
  "difficulty": "Intermediate",
  "confidence": "High",
  "score_breakdown": {
    "interest_match": 0.25,
    "goal_alignment": 0.23,
    "latent_interest_match": 0.15,
    "context_match": 0.15,
    "educational_value": 0.18,
    "hype_penalty": 0.0,
    "final_score": 0.963
  },
  "rejected_alternative": { "title": "...", "reason": "High hype score..." }
}
```

---

## Security

- All API keys are server-side only (`.env`, never committed).
- OAuth tokens are stored client-side in `localStorage` only — never sent to any third party.
- `.env` is in `.gitignore`. Use `.env.example` as a template.

---

## License

MIT © 2026 [SaiDheeraj-19](https://github.com/SaiDheeraj-19)

---

<div align="center">

**Built with ❤️ for the Hackathon**

*"The goal is not to stop social media use. The goal is to make existing scrolling more useful."*

</div>
