"use client";

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import FixtureCard from '@/components/FixtureCard';
import { useTournament } from '@/lib/tournament-context';

export default function FixturesPage() {
  const { matches } = useTournament();
  const [selectedTab, setSelectedTab] = useState<'all' | '1' | '2' | '3' | '4' | 'knockout'>('all');

  const filteredMatches = matches.filter((m) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'knockout') return m.phase !== 'league';
    return m.matchday === parseInt(selectedTab);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative bg-pl-blue text-white rounded-2xl p-6 sm:p-10 overflow-hidden shadow-lg border-b-4 border-pl-blue-accent">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Tournament Schedule</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl uppercase italic tracking-wider text-white">
            FIXTURES & RESULTS
          </h1>
          <p className="text-white/85 text-sm max-w-2xl leading-relaxed">
            All 4 league matchdays and the knockout phase fixtures, with live status and results.
          </p>
        </div>
      </div>

      {/* Matchday Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
        {[
          { id: 'all', label: 'All Matches' },
          { id: '1', label: 'Matchday 1' },
          { id: '2', label: 'Matchday 2' },
          { id: '3', label: 'Matchday 3' },
          { id: '4', label: 'Matchday 4' },
          { id: 'knockout', label: 'Knockout Phase' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as 'all' | '1' | '2' | '3' | '4' | 'knockout')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              selectedTab === tab.id
                ? 'bg-pl-blue text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fixtures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map((match) => (
          <FixtureCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
