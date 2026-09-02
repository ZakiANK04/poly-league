"use client";

import React from 'react';
import BracketView from '@/components/BracketView';
import { Trophy } from 'lucide-react';

export default function BracketPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative bg-pl-blue text-white rounded-2xl p-6 sm:p-10 overflow-hidden shadow-lg border-b-4 border-pl-blue-accent">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Phase 2 • Championship Bracket</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl uppercase italic tracking-wider text-white">
            KNOCKOUT PHASE
          </h1>
            <p className="text-white/85 text-sm max-w-2xl leading-relaxed">
              Follow the elimination path through play-offs, semi-finals, and the grand final.
          </p>
        </div>
      </div>

      <BracketView />
    </div>
  );
}
