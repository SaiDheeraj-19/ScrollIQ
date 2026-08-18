"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UnifiedInteraction, InterestProfile, RecommendationResponse, UserGoal } from "@/types";
import { fetchInteractions, analyzeInteractions, getRecommendation, loadUserGoal, loadScrollIQActivity } from "@/lib/api";
import ReelCard from "@/components/ReelCard";
import InterestDNA from "@/components/InterestDNA";
import RecommendationCard from "@/components/RecommendationCard";
import JudgeOutput from "@/components/JudgeOutput";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, Target, TrendingUp, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
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

    // Load user goal from localStorage
    const goal = loadUserGoal();
    setUserGoal(goal);

    // Load recent ScrollIQ activity
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
    if (!label) return "text-zinc-400 bg-zinc-100";
    if (label === "High") return "text-emerald-700 bg-emerald-100";
    if (label === "Medium") return "text-amber-700 bg-amber-100";
    if (label === "Mismatch") return "text-red-700 bg-red-100";
    return "text-orange-700 bg-orange-100";
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

      {/* USER GOAL BANNER */}
      {userGoal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-2xl flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Your Goal</p>
            <p className="text-zinc-900 font-bold text-lg">{userGoal.goal}</p>
            {userGoal.goal_description && userGoal.goal_description !== userGoal.goal && (
              <p className="text-zinc-500 text-sm mt-0.5">{userGoal.goal_description}</p>
            )}
          </div>
          <button
            onClick={() => router.push("/onboarding")}
            className="text-xs text-blue-500 hover:text-blue-700 font-medium underline underline-offset-2 shrink-0"
          >
            Edit
          </button>
        </motion.div>
      )}

      {/* Overview Header */}
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
            <button
              onClick={handleYoutubeDisconnect}
              className="px-5 py-2.5 bg-white hover:bg-zinc-50 text-zinc-900 rounded-xl text-sm font-medium border border-zinc-200 shadow-sm"
            >
              Disconnect YouTube
            </button>
          ) : (
            <button
              onClick={handleYoutubeLogin}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              Connect YouTube
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-12 pb-20">

        {/* Stage 1: Your Interactions */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                {hasYoutubeToken ? "Your YouTube Liked Videos" : `Demo Dataset ${selectedDataset.toUpperCase()}`}
              </h2>
              {!hasYoutubeToken && (
                <p className="text-sm text-zinc-400 mt-1">Sample interactions — connect YouTube to use your real data.</p>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* INJECTED SMART RECOMMENDATION CARD */}
              {recommendation && (
                <motion.div
                  key="smart-recommendation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-1 sm:col-span-2 lg:col-span-1 ring-2 ring-emerald-500 rounded-3xl shadow-xl shadow-emerald-500/10"
                >
                  <RecommendationCard recommendation={recommendation} />
                </motion.div>
              )}

              {interactions.map((interaction, idx) => (
                <motion.div
                  key={interaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <ReelCard
                    interaction={interaction}
                    analyzedData={profile?.analyzedContent?.[interaction.id]}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Error message */}
          {analyzeError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{analyzeError}</p>
            </motion.div>
          )}

          {/* Analyze button */}
          {!profile && !loading && interactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center mt-12 gap-4"
            >
              {userGoal && (
                <p className="text-sm text-zinc-500 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  ScrollIQ will align recommendations with your goal: <strong className="text-zinc-700">{userGoal.goal}</strong>
                </p>
              )}
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Inferring Your Interests...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 group-hover:scale-110 transition-transform text-[#FF4F4F]" />
                    Analyze My Interests
                  </>
                )}
              </button>
            </motion.div>
          )}
        </section>

        {/* Stage 2: Interest DNA + Goal Alignment */}
        <AnimatePresence>
          {profile && recommendation && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pt-12 border-t border-zinc-200"
            >
              {/* Goal Alignment Banner */}
              {recommendation.goal_alignment && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                    recommendation.goal_alignment.mismatch_detected
                      ? "bg-red-50 border-red-200"
                      : "bg-emerald-50 border-emerald-200"
                  }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      recommendation.goal_alignment.mismatch_detected ? "bg-red-100" : "bg-emerald-100"
                    }`}>
                      {recommendation.goal_alignment.mismatch_detected
                        ? <AlertTriangle className="w-5 h-5 text-red-600" />
                        : <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-bold text-zinc-900">Goal ↔ Interest Alignment</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${goalAlignmentColor(recommendation.goal_alignment.label)}`}>
                          {recommendation.goal_alignment.label}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600">{recommendation.goal_alignment.reason}</p>
                    </div>
                    {recommendation.recommendation_direction && (
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-zinc-400 mb-1">Next Direction</p>
                        <p className="text-sm font-bold text-zinc-900 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          {recommendation.recommendation_direction}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Interest DNA */}
              <div className="mb-12">
                <InterestDNA profile={profile} />
              </div>

              {/* Official Judge Output */}
              <div className="mt-4">
                <JudgeOutput profile={profile} recommendation={recommendation} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Recent ScrollIQ Activity */}
        {recentActivity.length > 0 && (
          <section className="pt-10 border-t border-zinc-200">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-zinc-400" />
              <h2 className="text-lg font-bold text-zinc-900">Recent Activity on ScrollIQ</h2>
              <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">First-party data</span>
            </div>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                      {activity.event === "completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-zinc-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 line-clamp-1">{activity.title}</p>
                      <p className="text-xs text-zinc-400 capitalize">{activity.event} via ScrollIQ</p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0 ml-4">{formatRelativeTime(activity.timestamp)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
