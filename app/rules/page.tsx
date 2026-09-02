"use client";

import React from 'react';
import { Award, BookOpen, CalendarDays, ShieldCheck, Shuffle, Target, Trophy } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="relative bg-pl-blue text-white rounded-xl p-5 sm:p-8 overflow-hidden shadow-lg border-b-4 border-pl-blue-accent">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Official Rulebook</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl uppercase italic tracking-wider text-white">
            TOURNAMENT FORMAT & RULES
          </h1>
          <p className="text-white/85 text-sm max-w-2xl leading-relaxed">
            The competition is divided into two distinct stages: Phase 1 (UCL League Phase) and Phase 2 (The Final Phase).
          </p>
        </div>
      </div>

      {/* Phase 1 */}
      <div className="bg-white rounded-xl p-5 sm:p-7 shadow-md border border-gray-200 space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-pl-blue text-white font-display text-lg flex items-center justify-center font-bold">
            1
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-pl-black uppercase italic">
            PHASE 1: THE LEAGUE PHASE (UCL STYLE)
          </h2>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed">
          All 8 teams compete in a single unified league table. Each team plays <strong>4 matches</strong> against 4 different opponents as determined by the official live draw on the Poly League Facebook group.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <Award className="w-5 h-5 text-pl-blue mb-2" aria-hidden="true" />
            <span className="font-display text-xl text-pl-blue block">POINTS SYSTEM</span>
            <ul className="text-xs text-gray-600 mt-2 space-y-1">
              <li>• Win = 3 Points</li>
              <li>• Draw = 1 Point</li>
              <li>• Loss = 0 Points</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <Target className="w-5 h-5 text-pl-blue mb-2" aria-hidden="true" />
            <span className="font-display text-xl text-pl-blue block">TIEBREAKERS</span>
            <ul className="text-xs text-gray-600 mt-2 space-y-1">
              <li>1. Total Points</li>
              <li>2. Goal Difference (GD)</li>
              <li>3. Goals For (GF)</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <CalendarDays className="w-5 h-5 text-pl-blue mb-2" aria-hidden="true" />
            <span className="font-display text-xl text-pl-blue block">MATCHDAYS</span>
            <ul className="text-xs text-gray-600 mt-2 space-y-1">
              <li>• Four league rounds</li>
              <li>• One unified table</li>
              <li>• Results update live</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Phase 2 */}
      <div className="bg-white rounded-xl p-5 sm:p-7 shadow-md border border-gray-200 space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-amber-500 text-pl-black font-display text-lg flex items-center justify-center font-bold">
            2
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-pl-black uppercase italic">
            PHASE 2: THE FINAL KNOCKOUT PHASE
          </h2>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed">
          At the conclusion of the 4 matchdays, standings dictate progression into the single-elimination bracket:
        </p>

        <div className="space-y-3 pt-2">
          <div className="p-4 rounded-lg border-l-4 border-pl-green bg-green-50/50 flex gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 text-pl-green mt-0.5" aria-hidden="true" />
            <div>
            <strong className="text-pl-green font-display text-lg block uppercase">
              1. Direct Qualifiers (Rank 1 & 2)
            </strong>
            <p className="text-xs text-gray-700 mt-1">
              Teams finishing 1st and 2nd in the League Phase advance directly to the Semi-Finals.
            </p>
            </div>
          </div>

          <div className="p-4 rounded-lg border-l-4 border-pl-amber bg-amber-50/50 flex gap-3">
            <Shuffle className="w-5 h-5 shrink-0 text-pl-amber mt-0.5" aria-hidden="true" />
            <div>
            <strong className="text-pl-amber font-display text-lg block uppercase">
              2. Play-offs Round (Rank 3rd to 6th)
            </strong>
            <p className="text-xs text-gray-700 mt-1">
              Play-off 1: 3rd vs 6th • Play-off 2: 4th vs 5th. Knockout pairings randomized and finalized live by captains.
            </p>
            </div>
          </div>

          <div className="p-4 rounded-lg border-l-4 border-pl-blue bg-blue-50/50 flex gap-3">
            <Trophy className="w-5 h-5 shrink-0 text-pl-blue mt-0.5" aria-hidden="true" />
            <div>
            <strong className="text-pl-blue font-display text-lg block uppercase">
              3. Semi-Finals & The Grand Final
            </strong>
            <p className="text-xs text-gray-700 mt-1">
              Single-elimination matches leading to the championship showdown.
            </p>
            </div>
          </div>

          <div className="p-4 rounded-lg border-l-4 border-pl-red bg-red-50/50 flex gap-3">
            <CalendarDays className="w-5 h-5 shrink-0 text-pl-red mt-0.5" aria-hidden="true" />
            <div>
            <strong className="text-pl-red font-display text-lg block uppercase">
              4. Elimination (Rank 7 & 8)
            </strong>
            <p className="text-xs text-gray-700 mt-1">
              Teams finishing in the bottom 2 spots are eliminated at the end of the League Phase.
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
