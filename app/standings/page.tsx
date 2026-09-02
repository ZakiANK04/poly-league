"use client";

import React from 'react';
import StandingsTable from '@/components/StandingsTable';
import { Trophy } from 'lucide-react';

export default function StandingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative bg-pl-blue text-white rounded-2xl p-6 sm:p-10 overflow-hidden shadow-lg border-b-4 border-pl-blue-accent">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Phase 1 • Official Standings</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl uppercase italic tracking-wider leading-[1.08] text-white">
            LEAGUE PHASE STANDINGS
          </h1>
          <p className="text-white/85 text-sm max-w-2xl leading-relaxed">
            Live standings dynamically calculated from finished fixtures. Teams are ranked by Points, followed by Goal Difference (GD), then Goals For (GF).
          </p>
        </div>
      </div>

      {/* Detailed Standings Table */}
      <StandingsTable compact={false} />

      {/* Rules Explainer Box */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-l-4 border-pl-green pl-4">
          <h4 className="font-display text-xl text-pl-black uppercase">1st & 2nd Place</h4>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Qualify directly to the Knockout Semi-Finals. Bypass the single-elimination play-off stage entirely.
          </p>
        </div>
        <div className="border-l-4 border-pl-amber pl-4">
          <h4 className="font-display text-xl text-pl-black uppercase">3rd to 6th Place</h4>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Advance to the Play-offs Round. Play a knockout match to determine the final 2 semifinalists.
          </p>
        </div>
        <div className="border-l-4 border-pl-red pl-4">
          <h4 className="font-display text-xl text-pl-black uppercase">7th & 8th Place</h4>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Eliminated at the end of the League Phase. Do not participate in the Knockout Final Phase.
          </p>
        </div>
      </div>
    </div>
  );
}
