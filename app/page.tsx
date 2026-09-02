"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import AnnouncementCarousel from '@/components/AnnouncementCarousel';
import StandingsTable from '@/components/StandingsTable';
import FixtureCard from '@/components/FixtureCard';
import { useTournament } from '@/lib/tournament-context';
import { CircleHelp, Smartphone, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { matches, teams } = useTournament();

  const recentOrLive = matches.filter((m) => m.status === 'live' || m.status === 'finished').slice(-4).reverse();
  const upcoming = matches.filter((m) => m.status === 'scheduled').slice(0, 4);

  return (
    <div className="page-reveal space-y-8 pb-10 sm:space-y-10 sm:pb-16">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Official Announcement Carousel */}
      <AnnouncementCarousel />

      {/* 3. Live League Standings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-rule flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pl-blue-accent uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>Phase 1 • UCL League Standings</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl uppercase italic text-pl-black">
              LIVE TOURNAMENT TABLE
            </h2>
          </div>
          <Link
            href="/standings"
            className="text-pl-blue-accent hover:text-pl-blue font-bold text-xs uppercase tracking-wider flex items-center gap-1 group"
          >
            <span>Detailed Standings & Stats</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <StandingsTable compact={true} />
      </section>

      {/* 4. Matchday Fixtures Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-rule flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pl-blue-accent uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Featured Fixtures</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl uppercase italic text-pl-black">
              MATCHDAY ACTION
            </h2>
          </div>
          <Link
            href="/fixtures"
            className="text-pl-blue-accent hover:text-pl-blue font-bold text-xs uppercase tracking-wider flex items-center gap-1 group"
          >
            <span>Full Schedule (Matchday 1 to 4)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcoming.length > 0 ? (
            upcoming.map((match) => <FixtureCard key={match.id} match={match} />)
          ) : (
            recentOrLive.map((match) => <FixtureCard key={match.id} match={match} />)
          )}
        </div>
      </section>

      {/* 5. Competing Teams Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-rule text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pl-blue-accent uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>The Contenders</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl uppercase italic text-pl-black">
            8 DEPARTMENTS COMPETING
          </h2>
          <p className="text-gray-600 text-sm max-w-lg mx-auto mt-1 font-normal">
            Select any department to view their captain, squad status, and match results.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
          {teams.map((team) => (
            <motion.div
              key={team.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={`/teams/${team.code.toLowerCase()}`}
                className="bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-lg border border-gray-200 flex flex-col items-center text-center transition-all group h-full"
              >
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 mb-3 group-hover:scale-105 transition-transform">
                  <Image
                    src={team.badgeUrl}
                    alt={team.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-display text-xl sm:text-2xl text-pl-black group-hover:text-pl-blue leading-none">
                  {team.code}
                </span>
                <span className="text-xs text-gray-500 font-medium mt-1">
                  {team.department}
                </span>
                <div className="mt-4 pt-3 border-t border-gray-100 w-full text-[11px] text-gray-600">
                  Captain: <strong className="text-gray-900 block truncate">{team.captainName}</strong>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8" aria-label="Fantasy mode coming soon">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-pl-black px-6 py-10 text-center text-white shadow-xl sm:px-10 sm:py-14">
          <div className="absolute inset-0 bg-diagonal-pattern opacity-10" />
          <div className="relative flex flex-col items-center gap-4">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" aria-hidden="true" />
            <div className="relative flex h-36 w-20 items-center justify-center rounded-[1.25rem] border-2 border-amber-300/70 bg-pl-blue/50 shadow-[0_0_35px_rgba(222,190,118,.45)] sm:h-44 sm:w-24">
              <div className="absolute left-1/2 top-2 h-1 w-8 -translate-x-1/2 rounded-full bg-white/40" />
              <Smartphone className="absolute inset-0 m-auto h-16 w-16 text-white/15 sm:h-20 sm:w-20" aria-hidden="true" />
              <CircleHelp className="relative z-10 h-12 w-12 text-amber-300 sm:h-14 sm:w-14" aria-hidden="true" />
            </div>
            <p className="font-display text-3xl uppercase italic text-amber-300 sm:text-4xl">Fantasy mode</p>
            <p className="max-w-md text-sm text-white/70">Build your squad, follow every score, and compete in a new way.</p>
            <span className="rounded-full border border-white/20 px-4 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-white/80">Coming soon</span>
          </div>
        </div>
      </section>
    </div>
  );
}
