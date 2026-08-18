import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRightCircle, Target } from 'lucide-react';
import { GoalMilestone } from '@/types';

export default function GoalProgressCard({ milestones, goal }: { milestones: GoalMilestone[], goal: string }) {
  if (!milestones || milestones.length === 0) return null;

  const renderIcon = (status: string) => {
    switch (status) {
      case 'Observed':
      case 'Exploring':
      case 'Learning':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'Next':
        return <ArrowRightCircle className="w-5 h-5 text-blue-500 shrink-0" />;
      case 'Future':
        return <Circle className="w-5 h-5 text-zinc-300 shrink-0" />;
      default:
        return <Circle className="w-5 h-5 text-zinc-300 shrink-0" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Observed':
      case 'Exploring':
      case 'Learning':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Next':
        return 'text-blue-700 bg-blue-50 border-blue-200 ring-2 ring-blue-500 ring-offset-1';
      case 'Future':
        return 'text-zinc-500 bg-zinc-50 border-zinc-200';
      default:
        return 'text-zinc-500 bg-zinc-50 border-zinc-200';
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 lg:p-8 shadow-sm h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
          <Target className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Your Goal Progress</h3>
          <p className="text-sm font-medium text-blue-600 mt-0.5">{goal.toUpperCase()}</p>
        </div>
      </div>

      <div className="relative pl-6 border-l-2 border-zinc-100 ml-4 space-y-6">
        {milestones.map((m, i) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="relative flex items-center justify-between"
          >
            <div className="absolute -left-[35px] bg-white">
              {renderIcon(m.status)}
            </div>
            <div className="flex-1 ml-2 flex items-center justify-between">
              <span className={`text-sm md:text-base font-bold ${m.status === 'Next' ? 'text-zinc-900' : 'text-zinc-700'}`}>
                {m.topic}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(m.status)}`}>
                {m.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
