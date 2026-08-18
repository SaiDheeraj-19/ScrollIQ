import { UnifiedInteraction, InterestProfile, RecommendationResponse, UserGoal } from "../types";

const API_BASE = "http://localhost:8000/api";

export function loadUserGoal(): UserGoal | null {
  try {
    const stored = localStorage.getItem("scrolliq_user_goal");
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export async function fetchInteractions(youtubeToken?: string | null, datasetId: string = "a"): Promise<UnifiedInteraction[]> {
  let url = `${API_BASE}/reels`;
  if (youtubeToken) {
    url += `?provider=youtube&token=${youtubeToken}`;
  } else {
    url += `?provider=demo&dataset=${datasetId}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch interactions");
  return res.json();
}

export async function fetchCandidates(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/candidates`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchDynamicFeed(query: string, youtubeToken?: string): Promise<any[]> {
  const headers: Record<string, string> = {};
  if (youtubeToken) {
    headers["Authorization"] = `Bearer ${youtubeToken}`;
  }
  
  const res = await fetch(`${API_BASE}/feed/youtube?query=${encodeURIComponent(query)}`, {
    headers
  });
  if (!res.ok) return fetchCandidates(); // Fallback
  return res.json();
}

export async function analyzeInteractions(
  interactions: UnifiedInteraction[],
  userGoal?: UserGoal | null
): Promise<InterestProfile> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interactions, user_goal: userGoal || null }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Failed to analyze interactions" }));
    throw new Error(error.detail || "Failed to analyze interactions");
  }
  return res.json();
}

export async function getRecommendation(
  profile: InterestProfile,
  recent_interactions: UnifiedInteraction[],
  providerToken?: string | null,
  userGoal?: UserGoal | null
): Promise<RecommendationResponse> {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      profile, 
      recent_interactions, 
      providerToken,
      user_goal: userGoal || null
    }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Failed to get recommendation" }));
    throw new Error(error.detail || "Failed to get recommendation");
  }
  return res.json();
}

// Record a ScrollIQ first-party interaction event
export async function recordScrollIQActivity(
  videoId: string, 
  title: string, 
  action: "opened" | "watched" | "saved" | "shared",
  durationSeconds?: number
) {
  // Convert standard activity to a UnifiedInteraction so it feeds into the main engine
  const interaction: UnifiedInteraction = {
    id: `scrolliq_${Date.now()}`,
    source: "scrolliq",
    contentType: "short",
    contentId: videoId,
    title: title,
    behavior: {
      liked: action === "saved",
      saved: action === "saved",
      shared: action === "shared",
      watchPercent: durationSeconds // We pass duration as watchPercent for simplicity in backend
    }
  };
  try {
    const stored = localStorage.getItem("scrolliq_activity") || "[]";
    const activities = JSON.parse(stored);
    activities.unshift(interaction);
    // Keep last 20 events
    localStorage.setItem("scrolliq_activity", JSON.stringify(activities.slice(0, 20)));
  } catch {}
}

export function loadScrollIQActivity(): Array<{ videoId: string; title: string; event: string; timestamp: string }> {
  try {
    const stored = localStorage.getItem("scrolliq_activity") || "[]";
    return JSON.parse(stored);
  } catch { return []; }
}
