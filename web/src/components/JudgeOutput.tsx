import React, { useState } from 'react';
import { RecommendationResponse, InterestProfile } from '@/types';
import { Terminal, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface JudgeOutputProps {
  profile: InterestProfile;
  recommendation: RecommendationResponse;
}

export default function JudgeOutput({ profile, recommendation }: JudgeOutputProps) {
  const [copied, setCopied] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const bd = recommendation.score_breakdown;
  const ga = recommendation.goal_alignment;
  const rej = recommendation.rejected_alternative;

  const outputText = `CURRENT REEL:
  ID: ${recommendation.currentReel}
  Title: ${recommendation.currentReelTitle || "—"}

USER GOAL:
  Goal: ${recommendation.user_goal?.goal || "Not specified"}
  Description: ${recommendation.user_goal?.goal_description || "—"}

SURFACE TOPICS:
  ${(recommendation.surface_topics || profile.surface_topics || []).join(", ") || "—"}

INTEREST DETECTED:
  ${recommendation.interestDetected}
  Confidence: ${recommendation.confidence}

WHY:
  ${profile.reasoning || recommendation.why}

GOAL ALIGNMENT:
  Score: ${ga ? (ga.score * 100).toFixed(0) + "%" : "—"}
  Label: ${ga?.label || "—"}
  ${ga?.mismatch_detected ? "⚠️  MISMATCH DETECTED" : ""}
  Reason: ${ga?.reason || "—"}

RECOMMENDATION DIRECTION:
  ${recommendation.recommendation_direction || "—"}

RECOMMENDED TECH REEL:
  ${recommendation.recommendedTechReel}
  Channel: ${recommendation.channel || "—"}
  URL: ${recommendation.videoUrl || (recommendation.videoId ? `https://youtube.com/shorts/${recommendation.videoId}` : "—")}

DEEP DIVE ARTICLE:
  ${recommendation.recommendedArticle ? recommendation.recommendedArticle.title : "—"}
  URL: ${recommendation.recommendedArticle ? recommendation.recommendedArticle.url : "—"}

CATEGORY: ${recommendation.category}

WHY THIS RECOMMENDATION:
  ${recommendation.whyRecommendation}

DIFFICULTY: ${recommendation.difficulty}
CONFIDENCE: ${recommendation.confidence}

WHY NOT (Rejected Alternative):
  Title: ${rej?.title || recommendation.rejectedCandidates?.[0] || "—"}
  Reason: ${rej?.reason || recommendation.whyNot || "—"}

SCORE BREAKDOWN:
  Interest Match:        ${bd ? (bd.interest_match * 100).toFixed(0) + "%" : "—"}
  Goal Alignment:        ${bd ? (bd.goal_alignment * 100).toFixed(0) + "%" : "—"}
  Latent Interest:       ${bd ? (bd.latent_interest_match * 100).toFixed(0) + "%" : "—"}
  Context Match:         ${bd ? (bd.context_match * 100).toFixed(0) + "%" : "—"}
  Educational Value:     ${bd ? (bd.educational_value * 100).toFixed(0) + "%" : "—"}
  Hype Penalty:          ${bd ? (bd.hype_penalty * 100).toFixed(0) + "%" : "—"}
  Final Score:           ${bd ? bd.final_score.toFixed(3) : "—"}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0D1117] border border-slate-800 rounded-3xl p-6 md:p-8 font-mono text-sm relative overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3 text-slate-300">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold tracking-wide">OFFICIAL HACKATHON OUTPUT CONTRACT</h3>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary fields — always visible */}
      <div className="space-y-4 text-slate-400 leading-relaxed">

        {recommendation.user_goal?.goal && (
          <div><span className="text-slate-500">USER GOAL:</span><br />
            <span className="text-blue-300 ml-4">"{recommendation.user_goal.goal}"</span>
          </div>
        )}

        <div><span className="text-slate-500">SURFACE TOPICS:</span><br />
          <span className="text-zinc-300 ml-4">{(recommendation.surface_topics || profile.surface_topics || []).join(", ") || "—"}</span>
        </div>

        <div><span className="text-slate-500">INTEREST DETECTED:</span><br />
          <span className="text-emerald-300 ml-4 font-bold">{recommendation.interestDetected}</span>
        </div>

        {ga && (
          <div>
            <span className="text-slate-500">GOAL ↔ INTEREST ALIGNMENT:</span><br />
            <span className={`ml-4 font-bold ${ga.label === "High" ? "text-emerald-300" : ga.label === "Mismatch" ? "text-red-300" : "text-amber-300"}`}>
              {ga.label} ({ga.score ? (ga.score * 100).toFixed(0) : "?"}%)
            </span>
            {ga.mismatch_detected && (
              <span className="ml-2 text-red-400">⚠️ MISMATCH</span>
            )}
            <br />
            <span className="text-slate-500 ml-4 text-xs">{ga.reason}</span>
          </div>
        )}

        {recommendation.recommendation_direction && (
          <div><span className="text-slate-500">NEXT DIRECTION:</span><br />
            <span className="text-blue-300 ml-4">→ {recommendation.recommendation_direction}</span>
          </div>
        )}

        <div><span className="text-slate-500">RECOMMENDED TECH REEL:</span><br />
          <span className="text-white ml-4 font-bold">{recommendation.recommendedTechReel}</span>
          {recommendation.videoUrl && (
            <><br /><a href={recommendation.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 ml-4 underline text-xs">{recommendation.videoUrl}</a></>
          )}
        </div>

        <div><span className="text-slate-500">DEEP DIVE ARTICLE (via Tavily):</span><br />
          {recommendation.recommendedArticle ? (
            <>
              <span className="text-zinc-300 ml-4 font-bold">{recommendation.recommendedArticle.title}</span><br />
              <a href={recommendation.recommendedArticle.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 ml-4 underline text-xs">
                {recommendation.recommendedArticle.url}
              </a>
            </>
          ) : (
            <span className="text-zinc-500 ml-4">—</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div><span className="text-slate-500">CATEGORY:</span><br /><span className="text-zinc-300">{recommendation.category}</span></div>
          <div><span className="text-slate-500">DIFFICULTY:</span><br /><span className="text-zinc-300">{recommendation.difficulty}</span></div>
          <div><span className="text-slate-500">CONFIDENCE:</span><br /><span className="text-zinc-300">{recommendation.confidence}</span></div>
        </div>

        <div><span className="text-slate-500">WHY THIS:</span><br />
          <span className="text-zinc-300 ml-4 text-xs leading-relaxed">{recommendation.whyRecommendation}</span>
        </div>

        {(recommendation.rejected_alternative || recommendation.whyNot) && (
          <div><span className="text-slate-500">WHY NOT:</span><br />
            <span className="text-amber-300 ml-4 font-semibold">{recommendation.rejected_alternative?.title || recommendation.rejectedCandidates?.[0] || "—"}</span><br />
            <span className="text-zinc-400 ml-4 text-xs">{recommendation.rejected_alternative?.reason || recommendation.whyNot}</span>
          </div>
        )}

        {/* Score Breakdown (collapsible) */}
        {bd && (
          <div>
            <button
              onClick={() => setShowBreakdown(v => !v)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors mt-2"
            >
              {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              SCORE BREAKDOWN
            </button>
            {showBreakdown && (
              <div className="mt-3 ml-4 space-y-1 text-xs border-l border-slate-800 pl-4">
                {[
                  ["Interest Match", bd.interest_match],
                  ["Goal Alignment", bd.goal_alignment],
                  ["Latent Interest", bd.latent_interest_match],
                  ["Context Match", bd.context_match],
                  ["Educational Value", bd.educational_value],
                  ["Hype Penalty", bd.hype_penalty],
                  ["Final Score", bd.final_score],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-slate-500">{label}:</span>
                    <span className={`font-mono ${Number(val) < 0 ? "text-red-400" : "text-slate-300"}`}>
                      {(Number(val) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-600">// ScrollIQ Output Contract v2</span>
        <span className="text-emerald-500 text-xs">● System Ready</span>
      </div>
    </div>
  );
}
