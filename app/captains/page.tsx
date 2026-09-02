"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { TEAMS } from '@/lib/mock-data';

export default function CaptainsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header matching source announcement card */}
      <div className="relative bg-pl-blue text-white rounded-2xl p-6 sm:p-10 overflow-hidden shadow-lg border-b-4 border-pl-blue-accent">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Autonomous Leadership</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl uppercase italic tracking-wider text-white">
            TEAM CAPTAINS
          </h1>
          <p className="text-white/85 text-sm leading-relaxed">
            The tournament’s organizers are the 8 department captains themselves. Each captain directly manages their squad, sets match schedules, and enters official scores.
          </p>
        </div>
      </div>

      {/* Directory Table matching announcement post layout */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="bg-pl-blue text-white px-6 py-4 flex items-center justify-between font-display text-base uppercase tracking-wider border-b-2 border-pl-blue-accent">
          <span>TEAM</span>
          <span>CAPTAIN NAME</span>
        </div>

        <div className="divide-y divide-gray-200">
          {TEAMS.map((team, idx) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between hover:bg-blue-50/60 transition-colors"
            >
              <Link
                href={`/teams/${team.code.toLowerCase()}`}
                className="flex min-w-0 items-center gap-4 group"
              >
                <div className="relative w-14 h-14 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Image
                    src={team.badgeUrl}
                    alt={team.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-display text-2xl text-pl-black group-hover:text-pl-blue block leading-none">
                    {team.code}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {team.department}
                  </span>
                </div>
              </Link>

              <div className="min-w-0 text-left sm:text-right">
                <span className="font-display text-lg sm:text-2xl text-pl-black block uppercase italic break-words">
                  {team.captainName}
                </span>
                <span className="text-[11px] text-pl-blue-accent font-bold uppercase">
                  Official Team Captain
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
