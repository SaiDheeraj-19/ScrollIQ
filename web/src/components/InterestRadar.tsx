"use client";

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { InterestProfile } from '@/types';

export default function InterestRadar({ profile }: { profile: InterestProfile }) {
  // Build data array for the radar chart
  const confMap: Record<string, number> = { "High": 90, "Medium": 60, "Low": 30 };
  const primaryScore = confMap[profile.primaryInterest.confidence] || 75;

  const data = [
    {
      subject: profile.primaryInterest.name.substring(0, 15) + (profile.primaryInterest.name.length > 15 ? '...' : ''),
      score: primaryScore,
      fullMark: 100,
    },
    ...profile.supportingInterests.map(interest => ({
      subject: interest.name.substring(0, 15) + (interest.name.length > 15 ? '...' : ''),
      score: Math.round(interest.score * 100),
      fullMark: 100,
    }))
  ];

  // If there are less than 3 data points, a radar chart doesn't render well. 
  // Add some empty points to make it a triangle at least.
  while (data.length < 3) {
    data.push({ subject: '', score: 0, fullMark: 100 });
  }

  return (
    <div className="w-full h-[250px] bg-zinc-50 rounded-2xl border border-zinc-200 p-2 flex items-center justify-center relative">
      <div className="absolute top-4 left-4 z-10">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Interest Mapping</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="55%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e4e4e7" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#71717a', fontSize: 11, fontWeight: 600 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#09090b', fontWeight: 'bold' }}
          />
          <Radar
            name="Interest Match"
            dataKey="score"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
