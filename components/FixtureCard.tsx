"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Match } from '@/lib/types';

export default function FixtureCard({ match }: { match: Match }) {
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  const dateStr = new Date(match.scheduledAt).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const timeStr = new Date(match.scheduledAt).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
    >
      {/* Top Header */}
      <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between border-b border-gray-200 text-xs">
        <span className="font-display text-sm tracking-wider uppercase text-pl-blue">
          {match.roundLabel || `Matchday ${match.matchday}`}
        </span>

        {isLive ? (
          <span className="bg-red-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            LIVE
          </span>
        ) : isFinished ? (
          <span className="bg-gray-800 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
            FULL TIME
          </span>
        ) : (
          <div className="flex items-center gap-1 text-gray-600 text-[11px] font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>{dateStr} • {timeStr}</span>
          </div>
        )}
      </div>

      {/* Matchup Layout */}
      <div className="p-5 flex items-center justify-between gap-4">
        {/* Home Team */}
        <Link
          href={`/teams/${match.homeTeam.code.toLowerCase()}`}
          className="flex-1 flex flex-col items-center text-center gap-2 group"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 group-hover:scale-105 transition-transform">
            <Image
              src={match.homeTeam.badgeUrl}
              alt={match.homeTeam.name}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-display text-2xl text-pl-black group-hover:text-pl-blue block leading-none">
              {match.homeTeam.code}
            </span>
            <span className="text-[11px] text-gray-500 block truncate max-w-[120px] font-medium mt-0.5">
              {match.homeTeam.department}
            </span>
          </div>
        </Link>

        {/* Center VS / Score */}
        <div className="flex flex-col items-center justify-center px-2">
          {isFinished || isLive ? (
            <div className="flex items-center gap-2 font-display text-3xl sm:text-4xl text-pl-black font-bold tracking-wider">
              <span className={match.homeScore! > match.awayScore! ? 'text-pl-blue-accent' : ''}>
                {match.homeScore}
              </span>
              <span className="text-gray-300">-</span>
              <span className={match.awayScore! > match.homeScore! ? 'text-pl-blue-accent' : ''}>
                {match.awayScore}
              </span>
            </div>
          ) : (
            <div className="font-display text-2xl sm:text-3xl text-pl-blue-accent font-bold tracking-widest italic">
              VS
            </div>
          )}
        </div>

        {/* Away Team */}
        <Link
          href={`/teams/${match.awayTeam.code.toLowerCase()}`}
          className="flex-1 flex flex-col items-center text-center gap-2 group"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 group-hover:scale-105 transition-transform">
            <Image
              src={match.awayTeam.badgeUrl}
              alt={match.awayTeam.name}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-display text-2xl text-pl-black group-hover:text-pl-blue block leading-none">
              {match.awayTeam.code}
            </span>
            <span className="text-[11px] text-gray-500 block truncate max-w-[120px] font-medium mt-0.5">
              {match.awayTeam.department}
            </span>
          </div>
        </Link>
      </div>

      {/* Venue remains an admin fixture setting and is intentionally private. */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-end text-[11px] text-gray-500">
        {match.lastUpdatedBy && (
          <span className="text-[10px] text-gray-400 italic">
            Updated by {match.lastUpdatedBy}
          </span>
        )}
      </div>
    </motion.div>
  );
}
