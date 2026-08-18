"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UnifiedInteraction, InterestProfile, RecommendationResponse, UserGoal } from "@/types";
import { fetchInteractions, analyzeInteractions, getRecommendation, loadUserGoal, loadScrollIQActivity } from "@/lib/api";
import ReelCard from "@/components/ReelCard";
import InterestDNA from "@/components/InterestDNA";
import RecommendationCard from "@/components/RecommendationCard";
import JudgeOutput from "@/components/JudgeOutput";
import GoalProgressCard from "@/components/GoalProgressCard";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, Target, TrendingUp, Clock, AlertTriangle, CheckCircle2, FileSearch, LineChart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [interactions, setInteractions] = useState<UnifiedInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [profile, setProfile] = useState<InterestProfile | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [hasYoutubeToken, setHasYoutubeToken] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState("a");
  const [userGoal, setUserGoal] = useState<UserGoal | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<Array<{ title: string; event: string; timestamp: string }>>([]);

  const loadInteractions = useCallback((token: string | null, datasetId: string) => {
    setLoading(true);
    fetchInteractions(token, datasetId)
      .then(data => setInteractions(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("youtube_token");
    if (tokenFromUrl) {
      localStorage.setItem("youtube_access_token", tokenFromUrl);
      window.history.replaceState({}, document.title, "/app");
    }

    const token = localStorage.getItem("youtube_access_token");
    setHasYoutubeToken(!!token);
    loadInteractions(token, selectedDataset);

    const goal = loadUserGoal();
    setUserGoal(goal);

    setRecentActivity(loadScrollIQActivity());
  }, [loadInteractions, selectedDataset]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const token = localStorage.getItem("youtube_access_token");
      const dna = await analyzeInteractions(interactions, userGoal);
      setProfile(dna);

      const rec = await getRecommendation(dna, interactions, token, userGoal);
      setRecommendation(rec);
      localStorage.setItem("scrolliq_last_recommendation", JSON.stringify(rec));
    } catch (error: any) {
      setAnalyzeError(error.message || "Analysis failed. Ensure the FastAPI backend is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleYoutubeLogin = () => {
    window.location.href = "http://localhost:8000/api/integrations/youtube/login";
  };

  const handleYoutubeDisconnect = () => {
    localStorage.removeItem("youtube_access_token");
    window.location.reload();
  };

  const goalAlignmentColor = (label?: string) => {
    if (!label) return "text-zinc-400 bg-zinc-100 border-zinc-200";
    if (label === "High") return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (label === "Medium") return "text-amber-700 bg-amber-50 border-amber-200";
    if (label === "Mismatch") return "text-red-700 bg-red-50 border-red-200";
    return "text-orange-700 bg-orange-50 border-orange-200";
  };

  const formatRelativeTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto selection:bg-zinc-200">

      {/* TOP: USER GOAL BANNER */}
      {userGoal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Your Goal</p>
              <p className="text-zinc-900 font-bold text-lg">{userGoal.goal}</p>
            </div>
          </div>
          {recommendation?.goal_alignment && (
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${goalAlignmentColor(recommendation.goal_alignment.label)}`}>
              <span className="text-xs font-bold uppercase tracking-wider">Goal Alignment</span>
              <span className="text-sm font-bold">{recommendation.goal_alignment.label}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* HEADER & SOURCE SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Analytics Overview</h1>
          <p className="text-zinc-500">Your behavioral DNA inferred from short-form interactions.</p>
        </div>
        <div className="flex items-center gap-4">
          {!hasYoutubeToken && (
            <select
              value={selectedDataset}
              onChange={(e) => { setSelectedDataset(e.target.value); setProfile(null); setRecommendation(null); }}
              className="px-4 py-2.5 bg-white text-zinc-900 rounded-xl border border-zinc-200 outline-none text-sm font-medium shadow-sm"
            >
              <option value="a">Dataset A — Java/Trap</option>
              <option value="b">Dataset B — Data Analytics</option>
              <option value="c">Dataset C — Cloud/DevOps</option>
            </select>
          )}
          {hasYoutubeToken ? (
            <button onClick={handleYoutubeDisconnect} className="px-5 py-2.5 bg-white hover:bg-zinc-50 text-zinc-900 rounded-xl text-sm font-medium border border-zinc-200 shadow-sm">
              Disconnect YouTube
            </button>
          ) : (
            <button onClick={handleYoutubeLogin} className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm">
              Connect YouTube
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-12 pb-20">

        {/* RAW INTERACTIONS PRE-ANALYSIS */}
        {!recommendation && (
          <section>
            {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-zinc-400" /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {interactions.map((interaction, idx) => (
                  <motion.div key={interaction.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                    <ReelCard interaction={interaction} />
                  </motion.div>
                ))}
              </div>
            )}

            {analyzeError && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{analyzeError}</p>
              </motion.div>
            )}

            {!profile && !loading && interactions.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center mt-12 gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 disabled:opacity-50 shadow-lg transition-all"
                >
                  {analyzing ? <><Loader2 className="w-5 h-5 animate-spin" />Inferring Your Interests...</> : <><Zap className="w-5 h-5 group-hover:scale-110 transition-transform text-[#FF4F4F]" />Analyze My Interests</>}
                </button>
              </motion.div>
            )}
          </section>
        )}

        {/* =========================================================================
            POST-ANALYSIS HACKATHON DASHBOARD (10 CARDS)
            ========================================================================= */}
        <AnimatePresence>
          {profile && recommendation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-12"
            >
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CARD 1: TECHNOLOGY DNA */}
                <div className="h-full">
                  <InterestDNA profile={profile} />
                </div>
                {/* CARD 2: GOAL PROGRESS */}
                <div className="h-full">
                  <GoalProgressCard milestones={recommendation.goal_progress || []} goal={userGoal?.goal || "Your Goal"} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CARD 3: WHAT YOU SELECTED */}
                <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">What You Selected</h3>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Your stated goal:</p>
                      <p className="text-lg font-bold text-blue-600 mt-1">"{userGoal?.goal || 'None'}"</p>
                    </div>
                  </div>
                </div>

                {/* CARD 4: WHAT SCROLLIQ DISCOVERED */}
                <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">What ScrollIQ Discovered</h3>
                  <div className="flex items-start gap-3">
                    <FileSearch className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Your behavior suggests:</p>
                      <p className="text-lg font-bold text-purple-600 mt-1">{profile.primaryInterest.name}</p>
                      {profile.supportingInterests.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs text-zinc-500 mb-2">Supporting interests:</p>
                          <div className="flex flex-wrap gap-2">
                            {profile.supportingInterests.slice(0, 3).map(i => (
                              <span key={i.name} className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md text-xs font-medium">{i.name}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* CARD 5: WHY? (EVIDENCE) */}
                <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Why?</h3>
                  <p className="text-sm text-zinc-600 mb-4">{profile.reasoning}</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.surface_topics.slice(0, 4).map(topic => (
                      <span key={topic} className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-xs font-medium">{topic}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CARD 6: GOAL ↔ BEHAVIOR ALIGNMENT */}
                <div className={`p-6 border rounded-3xl shadow-sm ${goalAlignmentColor(recommendation.goal_alignment?.label)}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-4 opacity-80">Goal ↔ Behavior Alignment</h3>
                  <div className="flex items-center gap-3 mb-3">
                    {recommendation.goal_alignment?.mismatch_detected ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                    <span className="text-xl font-bold">{recommendation.goal_alignment?.label}</span>
                  </div>
                  <p className="text-sm font-medium opacity-90">{recommendation.goal_alignment?.reason}</p>
                </div>

                {/* CARD 7: KNOWLEDGE GAPS */}
                {recommendation.knowledge_gap && (
                  <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Knowledge Gap Detected</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-6 h-6 text-amber-500" />
                      <span className="text-xl font-bold text-zinc-900">{recommendation.knowledge_gap.topic}</span>
                    </div>
                    <p className="text-sm text-zinc-600 font-medium">{recommendation.knowledge_gap.reason}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CARD 8: INTEREST EVOLUTION */}
                <div className="col-span-1 lg:col-span-2 p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm flex flex-col justify-between min-h-[200px]">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Interest Evolution</h3>
                    <p className="text-xs text-zinc-500 mb-4">Tracking alignment with "{userGoal?.goal || 'Your Goal'}"</p>
                  </div>
                  
                  {/* Mock Evolution Chart */}
                  <div className="w-full h-32 relative flex items-end">
                    {/* Background Grid */}
                    <div className="absolute inset-0 border-b border-l border-zinc-100 flex flex-col justify-between py-2">
                      <div className="border-t border-zinc-100/50 w-full"></div>
                      <div className="border-t border-zinc-100/50 w-full"></div>
                      <div className="border-t border-zinc-100/50 w-full"></div>
                    </div>
                    
                    {/* Goal Alignment Line (Upward) */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M 0,90 Q 25,85 50,60 T 100,20" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="0" cy="90" r="2" fill="#3b82f6" />
                      <circle cx="50" cy="60" r="2" fill="#3b82f6" />
                      <circle cx="100" cy="20" r="3" fill="#3b82f6" />
                      
                      {/* Distraction Line (Downward) */}
                      <path d="M 0,30 Q 30,35 60,70 T 100,85" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
                    </svg>
                    
                    {/* Labels */}
                    <div className="absolute -bottom-6 w-full flex justify-between text-[10px] text-zinc-400 font-medium">
                      <span>Last Week</span>
                      <span>Today</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex gap-4 text-xs font-medium justify-center">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Tech Focus</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Distractions</div>
                  </div>
                </div>

                {/* CARD 9: RECENT ACTIVITY */}
                <div className="col-span-1 p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Recent ScrollIQ Activity</h3>
                  {recentActivity.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">No activity recorded yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.slice(0, 4).map((activity, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <p className="text-xs font-medium text-zinc-900 line-clamp-1">{activity.title}</p>
                          <span className="text-[10px] text-zinc-400 ml-2 whitespace-nowrap">{formatRelativeTime(activity.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* CARD 10: NEXT BEST STEP (RECOMMENDATION) */}
              <div className="mt-12 pt-12 border-t border-zinc-200">
                <div className="mb-6 text-center">
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Your Next Best Step</h2>
                  <p className="text-zinc-500 mt-2">Based on your latent interests and your career goal.</p>
                </div>
                <div className="max-w-2xl mx-auto">
                  <RecommendationCard recommendation={recommendation} />
                </div>
              </div>

              {/* JUDGE OUTPUT */}
              <div className="mt-12">
                <JudgeOutput profile={profile} recommendation={recommendation} />
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
