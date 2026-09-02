"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';
import { useTournament } from '@/lib/tournament-context';

export default function TeamsPage() {
  const { teams } = useTournament();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative bg-pl-blue text-white rounded-2xl p-6 sm:p-10 overflow-hidden shadow-lg border-b-4 border-pl-blue-accent">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>The Competitors</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl uppercase italic tracking-wider text-white">
            THE 8 DEPARTMENTS
          </h1>
          <p className="text-white/85 text-sm max-w-2xl leading-relaxed">
            Explore every department competing in Poly League Season 2026. View captains, active squad status, and department records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teams.map((team, idx) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Link
              href={`/teams/${team.code.toLowerCase()}`}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-200 flex flex-col items-center text-center transition-all group h-full"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4 group-hover:scale-105 transition-transform">
                <Image
                  src={team.badgeUrl}
                  alt={team.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-display text-3xl text-pl-black group-hover:text-pl-blue leading-none">
                {team.code}
              </span>
              <span className="text-xs text-gray-500 font-semibold mt-1">
                {team.department}
              </span>

              <div className="mt-4 pt-4 border-t border-gray-100 w-full text-xs text-gray-600 flex items-center justify-between">
                <span>Captain:</span>
                <strong className="text-gray-900 truncate block max-w-[140px] text-right">{team.captainName}</strong>
              </div>

              <div className="mt-3 text-pl-blue-accent group-hover:underline text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <span>View Department Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
