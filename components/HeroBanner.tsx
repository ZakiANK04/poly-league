"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Activity, Calendar } from 'lucide-react';
import { useTournament } from '@/lib/tournament-context';

export default function HeroBanner() {
  const { matches } = useTournament();

  const liveMatches = matches.filter((m) => m.status === 'live');
  const featuredMatch = liveMatches.length > 0 
    ? liveMatches[0] 
    : matches.find((m) => m.status === 'finished') || matches[0];

  return (
    <div className="relative bg-pl-blue text-white overflow-hidden border-b-4 border-pl-blue-accent">
      {/* Repeating Diagonal Stripe Texture Overlay from asset.png */}
      <div className="absolute inset-0 bg-diagonal-pattern opacity-20 pointer-events-none" />

      {/* Top right running footballer silhouette (as specified in brief) */}
      <div className="absolute top-4 right-6 sm:right-12 opacity-15 pointer-events-none hidden md:block">
        <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor" className="text-white">
          <path d="M14.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-2.2 4.1L8.5 13.5l1.6 1.1 2.8-3.9 2.5 1.5-1.5 7.8 2 .4 1.7-8.8-3.4-2.1 1-3.2 2.7 2.2 1.3-1.6-3.7-3.1c-.5-.4-1.2-.5-1.8-.2l-4.5 2.5zM6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-amber-300">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span className="font-sakana text-[10px] tracking-[.08em]">Official Tournament Portal — Season 2026</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase italic tracking-wider leading-[.98] text-white">
                <span className="block">POLY</span>
                <span className="block">LEAGUE</span>
              </h1>
              <h2 className="font-display max-w-xl text-lg sm:text-2xl uppercase italic tracking-wide leading-[1.05] text-[#DEBE76]">
                8 DEPARTMENTS. 2 PHASES. ONE CHAMPION.
              </h2>
            </div>

            <p className="text-white/85 text-sm sm:text-base max-w-xl leading-relaxed font-normal">
              Experience college football at its peak. Follow the UCL-style League Phase, live match scores, dynamically updated standings, and the high-stakes Knockout Final Phase.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Link
                href="/standings"
                className="inline-flex min-h-11 items-center justify-center bg-white px-4 py-2 font-display text-base font-bold uppercase tracking-wider text-pl-blue shadow-lg transition-all hover:bg-amber-300 hover:text-pl-black active:scale-95 rounded-md"
              >
                View Standings
              </Link>
              <Link
                href="/fixtures"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/20 bg-pl-blue-accent/90 px-4 py-2 font-display text-base font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-pl-blue-accent active:scale-95"
              >
                All Fixtures
              </Link>
              <Link
                href="/bracket"
                className="badge-gold inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md px-4 py-2 text-base uppercase text-pl-black shadow-lg transition-all hover:opacity-95 active:scale-95"
              >
                <span>Finals Bracket</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Live Pitch Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            {featuredMatch && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/25 shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div className="flex items-center gap-2">
                    {featuredMatch.status === 'live' ? (
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    ) : (
                      <Activity className="w-4 h-4 text-amber-300" />
                    )}
                    <span className="font-display text-lg tracking-wider uppercase text-white">
                      {featuredMatch.status === 'live' ? 'Live on the Pitch' : 'Featured Match'}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-amber-300 uppercase tracking-wide">Season 2026</span>
                </div>

                <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/70 mb-3">
                    <span className="font-bold text-amber-400 uppercase tracking-wider">
                      {featuredMatch.roundLabel || `Matchday ${featuredMatch.matchday}`}
                    </span>
                    {featuredMatch.status === 'live' ? (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        LIVE
                      </span>
                    ) : (
                      <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {featuredMatch.status}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {/* Home Team */}
                    <Link
                      href={`/teams/${featuredMatch.homeTeam.code.toLowerCase()}`}
                      className="flex-1 flex flex-col items-center text-center gap-1.5 group"
                    >
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 group-hover:scale-105 transition-transform">
                        <Image
                          src={featuredMatch.homeTeam.badgeUrl}
                          alt={featuredMatch.homeTeam.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-display text-xl text-white group-hover:text-amber-300 transition">
                        {featuredMatch.homeTeam.code}
                      </span>
                    </Link>

                    {/* Scores / VS */}
                    <div className="px-4 py-2 bg-pl-blue-accent/90 rounded-lg font-display text-3xl sm:text-4xl text-white tracking-widest shadow-inner">
                      {featuredMatch.homeScore ?? '-'} : {featuredMatch.awayScore ?? '-'}
                    </div>

                    {/* Away Team */}
                    <Link
                      href={`/teams/${featuredMatch.awayTeam.code.toLowerCase()}`}
                      className="flex-1 flex flex-col items-center text-center gap-1.5 group"
                    >
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 group-hover:scale-105 transition-transform">
                        <Image
                          src={featuredMatch.awayTeam.badgeUrl}
                          alt={featuredMatch.awayTeam.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-display text-xl text-white group-hover:text-amber-300 transition">
                        {featuredMatch.awayTeam.code}
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-white/70 pt-1">
                  <span>Scores update in realtime</span>
                  <Link href="/fixtures" className="text-amber-300 hover:underline font-bold flex items-center gap-1">
                    <span>Full Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
            {!featuredMatch && (
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-3 text-amber-300">
                  <Calendar className="w-5 h-5" />
                  <span className="font-display text-xl uppercase tracking-wider">Draw pending</span>
                </div>
                <p className="text-sm text-white/75 mt-3 leading-relaxed">The league draw will appear here once the captains publish the first matchday.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
