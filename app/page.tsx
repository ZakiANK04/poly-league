"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, ArrowRight, CircleHelp, Smartphone, Sparkles } from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import StandingsTable from '@/components/StandingsTable';
import FixtureCard from '@/components/FixtureCard';
import HighlightsCarousel from '@/components/HighlightsCarousel';
import { useTournament } from '@/lib/tournament-context';

export default function HomePage() {
  const { matches, teams } = useTournament();
  const recentOrLive = matches.filter((m) => m.status === 'live' || m.status === 'finished').slice(-4).reverse();
  const upcoming = matches.filter((m) => m.status === 'scheduled').slice(0, 4);

  return <div className="page-reveal space-y-12 pb-10 sm:space-y-16 sm:pb-16">
    <HeroBanner />

    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div className="section-rule"><div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pl-blue-accent"><Trophy className="h-4 w-4" /> Phase 1 · UCL league standings</div><h2 className="mt-1 font-display text-3xl text-pl-black sm:text-4xl">Live tournament table</h2></div><Link href="/standings" className="inline-flex min-h-11 items-center gap-1 text-xs font-bold uppercase tracking-wider text-pl-blue-accent hover:text-pl-blue">Detailed standings & stats <ArrowRight className="h-4 w-4" /></Link></div>
      <StandingsTable compact />
    </section>

    <HighlightsCarousel />

    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div className="section-rule"><div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pl-blue-accent"><Calendar className="h-4 w-4" /> Matchday action</div><h2 className="mt-1 font-display text-3xl text-pl-black sm:text-4xl">Next under the lights</h2></div><Link href="/fixtures" className="inline-flex min-h-11 items-center gap-1 text-xs font-bold uppercase tracking-wider text-pl-blue-accent hover:text-pl-blue">Full schedule <ArrowRight className="h-4 w-4" /></Link></div>
      {upcoming.length > 0 || recentOrLive.length > 0 ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{(upcoming.length > 0 ? upcoming : recentOrLive).map((match) => <FixtureCard key={match.id} match={match} />)}</div> : <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-dashed border-pl-blue/25 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8"><div><p className="font-display text-5xl text-pl-blue/20">Matchday 01</p><p className="mt-2 text-sm text-gray-600">The official draw will appear here once the captains publish it.</p></div><Link href="/fixtures" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-pl-blue px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-pl-blue-accent">View fixtures <ArrowRight className="h-4 w-4" /></Link></div>}
    </section>

    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="section-rule mb-6 text-center"><div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pl-blue-accent"><Users className="h-4 w-4" /> The contenders</div><h2 className="mt-1 font-display text-3xl text-pl-black sm:text-4xl">8 departments competing</h2><p className="mx-auto mt-2 max-w-lg text-sm text-gray-600">Select a department to view its captain, squad status, and match results.</p></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">{teams.map((team) => <motion.div key={team.id} whileHover={{ y: -4 }} transition={{ duration: .2 }}><Link href={`/teams/${team.code.toLowerCase()}`} className="group flex h-full flex-col items-center rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:shadow-lg sm:p-5"><div className="relative mb-3 h-16 w-16 transition-transform group-hover:scale-105 sm:h-24 sm:w-24"><Image src={team.badgeUrl} alt={team.name} fill className="object-contain" /></div><span className="font-display text-xl text-pl-black group-hover:text-pl-blue sm:text-2xl">{team.code}</span><span className="mt-1 text-xs font-medium text-gray-500">{team.department}</span><div className="mt-4 w-full border-t border-gray-100 pt-3 text-[11px] text-gray-600">Captain: <strong className="block truncate text-gray-900">{team.captainName}</strong></div></Link></motion.div>)}</div>
    </section>

    <section className="px-4 sm:px-6 lg:px-8" aria-label="Fantasy mode coming soon"><div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-pl-black px-6 py-10 text-center text-white shadow-xl sm:px-10 sm:py-14"><div className="absolute inset-0 bg-diagonal-pattern opacity-10" /><div className="relative flex flex-col items-center gap-4"><Sparkles className="h-5 w-5 animate-pulse text-amber-300" aria-hidden="true" /><div className="relative flex h-36 w-20 items-center justify-center rounded-[1.25rem] border-2 border-amber-300/70 bg-pl-blue/50 shadow-[0_0_35px_rgba(222,190,118,.45)] sm:h-44 sm:w-24"><div className="absolute left-1/2 top-2 h-1 w-8 -translate-x-1/2 rounded-full bg-white/40" /><Smartphone className="absolute inset-0 m-auto h-16 w-16 text-white/15 sm:h-20 sm:w-20" aria-hidden="true" /><CircleHelp className="relative z-10 h-12 w-12 text-amber-300 sm:h-14 sm:w-14" aria-hidden="true" /></div><p className="font-display text-3xl text-amber-300 sm:text-4xl">Fantasy mode</p><p className="max-w-md text-sm text-white/70">Build your squad, follow every score, and compete in a new way.</p><span className="rounded-full border border-white/20 px-4 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-white/80">Coming soon</span></div></div></section>
  </div>;
}
