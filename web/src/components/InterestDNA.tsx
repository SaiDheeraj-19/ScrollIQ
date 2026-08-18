import React from 'react';
import { InterestProfile } from '@/types';
import { Dna, Sparkles, ShieldAlert, GitPullRequest } from 'lucide-react';
import InterestRadar from './InterestRadar';

export default function InterestDNA({ profile }: { profile: InterestProfile }) {
  const confMap: Record<string, number> = { "High": 90, "Medium": 60, "Low": 30 };
  const confValue = confMap[profile.primaryInterest.confidence] || 75;

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-zinc-100 rounded-xl">
          <Dna className="w-6 h-6 text-[#3b82f6]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Interest DNA</h2>
          <p className="text-sm text-zinc-500">Your deeply inferred persistent learning interests.</p>
        </div>
      </div>

      {/* Two-column: bars on left, radar on right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Column */}
        <div className="space-y-6">

          {/* Surface Topics */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
              Surface Topics Detected
            </span>
            <div className="flex flex-wrap gap-2">
              {(profile.surface_topics || []).map((topic, i) => (
                <span key={i} className="text-xs font-semibold px-3 py-1 bg-white border border-zinc-200 text-zinc-600 rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Primary / Latent Interest */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-xs font-bold text-[#FF4F4F] uppercase tracking-wider mb-1 block">
                  Inferred Latent Interest
                </span>
                <span className="text-xl font-bold text-zinc-900">{profile.primaryInterest.name}</span>
              </div>
              <span className="text-2xl font-black text-zinc-900">{confValue}%</span>
            </div>
            <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${confValue}%` }}
              />
            </div>
          </div>

          {/* Supporting Interests */}
          {profile.supportingInterests.length > 0 && (
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 block">
                Supporting Interests
              </span>
              <div className="space-y-4">
                {profile.supportingInterests.map((interest, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-700 font-medium">{interest.name}</span>
                      <span className="text-zinc-500 font-bold">{Math.round(interest.score * 100)}%</span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-300 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${interest.score * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Radar Chart */}
        <div className="flex flex-col justify-center">
          <InterestRadar profile={profile} />
        </div>
      </div>

      {/* AI Reasoning Engine */}
      <div className="pt-6 border-t border-zinc-100">
        <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-4 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          AI Reasoning Engine
        </h3>
        <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200 space-y-4">
          {(Array.isArray(profile.evidence) ? profile.evidence : []).map((ev: any, idx) => {
            const isString = typeof ev === 'string';
            return (
              <div key={idx} className="flex gap-3 text-sm text-zinc-600">
                <ShieldAlert className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                {isString ? (
                  <p className="leading-relaxed">{ev}</p>
                ) : (
                  <p className="leading-relaxed">
                    <strong>{ev.surface_topic}</strong> ({ev.observed_signal}): {ev.semantic_connection}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {profile.alternativeInterpretations && profile.alternativeInterpretations.length > 0 && (
          <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200 border-dashed">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-900 mb-3">
              <GitPullRequest className="w-4 h-4 text-[#10b981]" />
              Alternative Interpretations
            </h4>
            <div className="space-y-3">
              {profile.alternativeInterpretations.map((alt, idx) => (
                <div key={idx} className="text-xs text-zinc-500">
                  <span className="text-zinc-800 font-bold">{alt.interest}</span> ({alt.confidence}): {alt.reason}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
