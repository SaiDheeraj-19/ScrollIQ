import React from 'react';
import { UnifiedInteraction, AnalyzedContent } from '@/types';
import { ExternalLink, Brain, Target, MessageSquare } from 'lucide-react';

export default function ReelCard({ 
  interaction, 
  analyzedData 
}: { 
  interaction: UnifiedInteraction;
  analyzedData?: AnalyzedContent;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 flex justify-between items-start bg-zinc-50/50">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-white border border-zinc-200 px-2 py-1 rounded-md">
            {interaction.platform}
          </span>
          <h3 className="text-zinc-900 font-bold mt-2 leading-snug line-clamp-2">
            {interaction.title}
          </h3>
        </div>
        <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors bg-white border border-zinc-200 p-1.5 rounded-lg shadow-sm">
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-sm text-zinc-500 line-clamp-3 mb-4">
          {interaction.description}
        </p>

        {analyzedData ? (
          <div className="space-y-3 bg-zinc-50 rounded-xl p-3 border border-zinc-100">
            <div className="flex items-start gap-2">
              <Brain className="w-4 h-4 text-[#3b82f6] mt-0.5" />
              <div className="text-xs">
                <span className="text-zinc-400 font-medium">Topic:</span>
                <p className="text-zinc-900 font-bold">{analyzedData.topic}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-[#FF4F4F] mt-0.5" />
              <div className="text-xs">
                <span className="text-zinc-400 font-medium">Intent:</span>
                <p className="text-zinc-700">{analyzedData.apparentIntent}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-[#10b981] mt-0.5" />
              <div className="text-xs">
                <span className="text-zinc-400 font-medium">Complexity:</span>
                <p className="text-zinc-700">{analyzedData.technicalLevel}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 border-dashed text-center">
            <span className="text-xs text-zinc-400">Not analyzed yet</span>
          </div>
        )}
      </div>
    </div>
  );
}
