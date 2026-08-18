import React, { useState } from 'react';
import { RecommendationResponse } from '@/types';
import { Zap, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function RecommendationCard({ recommendation }: { recommendation: RecommendationResponse }) {
  const [showBaseline, setShowBaseline] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'submitting' | 'submitted'>('idle');

  const activeRec = showBaseline && recommendation.baseline ? recommendation.baseline : recommendation;

  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* View Toggle */}
      {recommendation.baseline && (
        <div className="flex justify-center mb-2">
          <div className="bg-zinc-100 p-1 rounded-xl inline-flex shadow-sm border border-zinc-200">
            <button 
              onClick={() => setShowBaseline(false)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!showBaseline ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              ScrollIQ AI
            </button>
            <button 
              onClick={() => setShowBaseline(true)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${showBaseline ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <AlertTriangle className="w-4 h-4" />
              Baseline AI
            </button>
          </div>
        </div>
      )}

      <div className={`bg-white border rounded-3xl p-6 md:p-8 flex-1 flex flex-col justify-between relative overflow-hidden transition-colors ${showBaseline ? 'border-amber-200' : 'border-zinc-200'} shadow-sm`}>
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className={`p-2.5 rounded-xl ${showBaseline ? 'bg-amber-100' : 'bg-zinc-100'}`}>
              <Zap className={`w-6 h-6 ${showBaseline ? 'text-amber-500' : 'text-[#FF4F4F]'}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                {showBaseline ? 'Baseline Recommendation' : 'Smart Recommendation'}
              </h2>
              <p className="text-sm text-zinc-500">
                {showBaseline ? 'The algorithmic echo chamber trap.' : 'Escaping the algorithmic echo chamber.'}
              </p>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 mb-6 relative z-10">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Recommended Topic</p>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4 leading-tight">
              {activeRec.recommendedTechReel}
            </h3>
            <div className="flex gap-2">
              <span className="text-xs font-semibold px-3 py-1 bg-white rounded-full text-zinc-600 border border-zinc-200">
                {activeRec.category}
              </span>
              <span className="text-xs font-semibold px-3 py-1 bg-white rounded-full text-zinc-600 border border-zinc-200">
                {activeRec.difficulty}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-8 relative z-10">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                {showBaseline ? 'Why (Keyword matching)' : 'Why this expands your learning'}
              </p>
              <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                {activeRec.whyRecommendation}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {!showBaseline && activeRec.antiHypeFilterApplied && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900 mb-1">Anti-Hype Filter Triggered</p>
                <p className="text-xs text-amber-700">
                  {activeRec.whyNot || `Rejected candidates: ${activeRec.rejectedCandidates.join(', ')}`}
                </p>
              </div>
            </div>
          )}

          {!showBaseline && activeRec.recommendedArticle && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start mb-6">
              <BookOpen className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-900 mb-1">Deep Dive Article</p>
                <p className="text-xs text-blue-800 font-medium mb-1 line-clamp-1">{activeRec.recommendedArticle.title}</p>
                <a 
                  href={activeRec.recommendedArticle.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-blue-600 hover:text-blue-700 underline underline-offset-2 flex items-center gap-1"
                >
                  Read full article <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          <Link 
            href="/app/watch"
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            Watch Feed <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
