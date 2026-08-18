"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, PlaySquare, Camera, Ghost, Loader2, Target } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const GOAL_PRESETS = [
  { label: "Become an AI/ML Engineer", icon: "🤖", categories: ["AI", "Machine Learning", "LLM Engineering"] },
  { label: "Become a Software Engineer", icon: "💻", categories: ["Software Engineering", "Backend", "System Design"] },
  { label: "Become a Data Analyst", icon: "📊", categories: ["Data Analytics", "SQL", "Python"] },
  { label: "Become a Cloud/DevOps Engineer", icon: "☁️", categories: ["Cloud", "DevOps", "Kubernetes"] },
  { label: "Become a Cybersecurity Engineer", icon: "🔐", categories: ["Cybersecurity", "Networking", "Security"] },
  { label: "Prepare for Tech Interviews", icon: "🎯", categories: ["DSA", "System Design", "Career"] },
  { label: "Build Products & Startups", icon: "🚀", categories: ["Full Stack", "Product", "Entrepreneurship"] },
  { label: "Explore Technology", icon: "🌐", categories: ["Technology", "Hardware", "Innovation"] },
];

import { Suspense } from "react";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [youtubeToken, setYoutubeToken] = useState<string | null>(null);

  const [handles, setHandles] = useState({ instagram: "", snapchat: "" });
  const [connections, setConnections] = useState({ instagram: false, snapchat: false });
  const [connecting, setConnecting] = useState({ instagram: false, snapchat: false });
  
  // Goal state
  const [selectedPreset, setSelectedPreset] = useState<typeof GOAL_PRESETS[0] | null>(null);
  const [customGoal, setCustomGoal] = useState("");
  const [timeSpent, setTimeSpent] = useState("");

  useEffect(() => {
    const token = searchParams.get("youtube_token");
    if (token) {
      localStorage.setItem("youtube_access_token", token);
      setYoutubeToken(token);
    } else {
      const existing = localStorage.getItem("youtube_access_token");
      if (existing) setYoutubeToken(existing);
    }
    // Pre-fill goal if it was already set
    const savedGoal = localStorage.getItem("scrolliq_user_goal");
    if (savedGoal) {
      try {
        const parsed = JSON.parse(savedGoal);
        const match = GOAL_PRESETS.find(p => p.label === parsed.goal);
        if (match) setSelectedPreset(match);
        if (parsed.goal_description) setCustomGoal(parsed.goal_description);
      } catch {}
    }
  }, [searchParams]);

  const handleMockConnect = (platform: 'instagram' | 'snapchat') => {
    setConnecting(prev => ({ ...prev, [platform]: true }));
    setTimeout(() => {
      setConnecting(prev => ({ ...prev, [platform]: false }));
      setConnections(prev => ({ ...prev, [platform]: true }));
    }, 1500);
  };

  const handleFinish = () => {
    // Save user goal to localStorage so the dashboard can use it
    const finalGoal = selectedPreset?.label || (customGoal ? "Custom Goal" : "");
    const finalDescription = customGoal || selectedPreset?.label || "";
    const finalCategories = selectedPreset?.categories || [];

    if (finalGoal) {
      localStorage.setItem("scrolliq_user_goal", JSON.stringify({
        goal: finalGoal,
        goal_description: finalDescription,
        goal_categories: finalCategories,
      }));
    }
    localStorage.setItem("scrolliq_onboarding_complete", "true");
    router.push("/app");
  };

  const goalDefined = selectedPreset !== null || customGoal.trim().length > 5;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans text-slate-50">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <div className="w-3 h-3 bg-slate-950 rounded-full"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight">ScrollIQ</span>
          </div>
          
          <div className="flex justify-center items-center gap-4 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                  step >= s ? "bg-blue-600 border-blue-600 text-white" : "bg-transparent border-slate-800 text-slate-500"
                }`}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s !== 3 && (
                  <div className={`w-12 h-[2px] ${step > s ? "bg-blue-600" : "bg-slate-800"}`}></div>
                )}
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-sm">
            {step === 1 ? "Define your goal" : step === 2 ? "Connect your data" : "You're all set"}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/10 blur-[100px] pointer-events-none"></div>

          <AnimatePresence mode="wait">
            
            {/* STEP 1: Goal Definition */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative z-10 space-y-6"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-6 h-6 text-blue-400" />
                    <h2 className="text-3xl font-bold">What are you trying to achieve?</h2>
                  </div>
                  <p className="text-slate-400">ScrollIQ uses your goal to align recommendations with where you want to go — not just what the algorithm thinks you like.</p>
                </div>

                {/* Preset Goals */}
                <div className="grid grid-cols-2 gap-3">
                  {GOAL_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => { setSelectedPreset(preset); setCustomGoal(""); }}
                      className={`p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                        selectedPreset?.label === preset.label
                          ? "bg-blue-600/20 border-blue-500 text-blue-300"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-lg mr-2">{preset.icon}</span>
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Or describe your own goal
                  </label>
                  <textarea
                    value={customGoal}
                    onChange={e => { setCustomGoal(e.target.value); setSelectedPreset(null); }}
                    className="block w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-24 resize-none text-sm"
                    placeholder='e.g. "I want to become an AI engineer and learn LLMs and RAG systems."'
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!goalDefined}
                    className="flex items-center gap-2 bg-white text-slate-950 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Connections */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative z-10 space-y-8"
              >
                <div>
                  {selectedPreset && (
                    <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-blue-600/10 border border-blue-800 rounded-xl text-blue-300 text-sm">
                      <Target className="w-4 h-4" />
                      Goal: <strong>{selectedPreset.label}</strong>
                    </div>
                  )}
                  <h2 className="text-3xl font-bold mb-3">Connect Platforms</h2>
                  <p className="text-slate-400">Authorize ScrollIQ to analyze your interactions. Only real connected platforms are used.</p>
                </div>

                <div className="space-y-4">
                  {/* YouTube - Real OAuth */}
                  <div className={`flex items-center justify-between p-5 bg-slate-950 border rounded-2xl transition-colors ${youtubeToken ? 'border-emerald-500/30' : 'border-slate-800'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                        <PlaySquare className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">YouTube</h4>
                        <p className="text-sm text-slate-400">Reads your liked tech videos via OAuth.</p>
                      </div>
                    </div>
                    {youtubeToken ? (
                      <span className="flex items-center gap-2 text-emerald-400 font-medium bg-emerald-400/10 px-4 py-2 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" /> Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => window.location.href = "http://localhost:8000/api/integrations/youtube/login"}
                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Connect
                      </button>
                    )}
                  </div>

                  {/* Instagram - Clearly labeled as unavailable */}
                  <div className="flex items-center justify-between p-5 bg-slate-950 border border-slate-800/50 rounded-2xl opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center">
                        <Camera className="w-6 h-6 text-pink-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Instagram</h4>
                        <p className="text-sm text-slate-400">Coming soon — API integration pending.</p>
                      </div>
                    </div>
                    <span className="px-4 py-2 border border-slate-700 rounded-lg text-slate-500 text-sm font-medium">
                      Coming Soon
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 bg-white text-slate-950 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    {youtubeToken ? "Continue" : "Skip for now"} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Done */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative z-10 space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-3">You're all set 🎉</h2>
                  <p className="text-slate-400">ScrollIQ will now analyze your interactions, infer your underlying interests, and compare them against your goal to recommend the most valuable tech content for you.</p>
                </div>

                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your ScrollIQ Profile</p>
                  
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Your Goal</p>
                      <p className="text-white font-semibold">{selectedPreset?.label || customGoal || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <PlaySquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Data Source</p>
                      <p className="text-white font-semibold">{youtubeToken ? "YouTube (Connected)" : "Demo Dataset"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinish}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 shadow-lg shadow-blue-500/25 transition-all"
                  >
                    Enter Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-sans">Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
