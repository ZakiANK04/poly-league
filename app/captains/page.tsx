"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Trophy, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTournament } from '@/lib/tournament-context';
import { MatchAssist, MatchScorer, Player, Team } from '@/lib/types';

type RankedPlayer = {
  player: Player;
  team: Team;
  value: number;
};

function RankingRow({ rank, player, team, value, label }: RankedPlayer & { rank: number; label: string }) {
  return (
    <li className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-0">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${rank === 1 ? 'bg-amber-400 text-pl-black' : rank === 2 ? 'bg-gray-200 text-gray-700' : rank === 3 ? 'bg-amber-700/20 text-amber-900' : 'bg-gray-50 text-gray-500'}`}>
        {rank}
      </span>
      <div className="relative h-9 w-9 shrink-0 rounded-full bg-gray-50 p-1">
        <Image src={team.badgeUrl} alt={`${team.name} logo`} fill className="object-contain p-1" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-gray-900">{player.name}</p>
        <p className="truncate text-[10px] font-bold uppercase tracking-wider text-pl-blue-accent">{team.code} · #{player.number}</p>
      </div>
      <strong className="shrink-0 text-right font-display text-xl text-pl-blue">
        {value}<span className="ml-1 block text-[9px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
      </strong>
    </li>
  );
}

export default function PlayersPage() {
  const { teams, players, matches, dataLoading } = useTournament();
  const teamById = new Map(teams.map((team) => [team.id, team]));
  const registeredPlayers = players.filter((player) => teamById.has(player.teamId));
  const completedMatches = matches.filter((match) => match.status === 'finished');

  const scorerTotals = new Map<string, { player: Player; team: Team; value: number }>();
  completedMatches.forEach((match) => {
    (match.scorers || []).forEach((scorer: MatchScorer) => {
      const player = players.find((candidate) => candidate.id === scorer.playerId);
      const team = teamById.get(scorer.teamId) || (player ? teamById.get(player.teamId) : undefined);
      if (!player || !team) return;
      const current = scorerTotals.get(player.id);
      scorerTotals.set(player.id, { player, team, value: (current?.value || 0) + 1 });
    });
  });
  const topScorers = Array.from(scorerTotals.values()).sort((a, b) => b.value - a.value || a.player.name.localeCompare(b.player.name)).slice(0, 5);

  const assistTotals = new Map<string, { player: Player; team: Team; value: number }>();
  completedMatches.forEach((match) => {
    (match.assists || []).forEach((assist: MatchAssist) => {
      const player = players.find((candidate) => candidate.id === assist.playerId);
      const team = teamById.get(assist.teamId) || (player ? teamById.get(player.teamId) : undefined);
      if (!player || !team) return;
      const current = assistTotals.get(player.id);
      assistTotals.set(player.id, { player, team, value: (current?.value || 0) + 1 });
    });
  });
  const topAssists = Array.from(assistTotals.values()).sort((a, b) => b.value - a.value || a.player.name.localeCompare(b.player.name)).slice(0, 5);

  const cleanSheetTotals = new Map<string, number>();
  completedMatches.forEach((match) => {
    const homeScore = match.homeScore ?? 0;
    const awayScore = match.awayScore ?? 0;
    if (awayScore === 0) cleanSheetTotals.set(match.homeTeamId, (cleanSheetTotals.get(match.homeTeamId) || 0) + 1);
    if (homeScore === 0) cleanSheetTotals.set(match.awayTeamId, (cleanSheetTotals.get(match.awayTeamId) || 0) + 1);
  });
  const cleanSheetRanking: RankedPlayer[] = teams.flatMap((team) => {
    const goalkeeper = registeredPlayers.find((player) => player.teamId === team.id && player.position === 'GK');
    const cleanSheets = cleanSheetTotals.get(team.id) || 0;
    return goalkeeper && cleanSheets > 0 ? [{ player: goalkeeper, team, value: cleanSheets }] : [];
  }).sort((a, b) => b.value - a.value || a.player.name.localeCompare(b.player.name)).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="relative overflow-hidden rounded-2xl bg-pl-blue p-6 text-white shadow-xl sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-diagonal-pattern opacity-20" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-amber-300"><Users className="h-4 w-4" /> Tournament players</div>
          <h1 className="font-display text-4xl uppercase italic tracking-wide sm:text-6xl">Players & rankings</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-white/80">Meet every registered player competing for Poly League. Follow the scoring race and see which first-registered goalkeeper is protecting each team’s clean sheets.</p>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3" aria-label="Player rankings">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md sm:p-7">
          <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-700"><Trophy className="h-5 w-5" /></div><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-pl-blue-accent">Official leaderboard</p><h2 className="font-display text-2xl uppercase text-pl-black">Top scorers</h2></div></div>
          {topScorers.length ? <ol>{topScorers.map((entry, index) => <RankingRow key={entry.player.id} rank={index + 1} {...entry} label={entry.value === 1 ? 'goal' : 'goals'} />)}</ol> : <RankingEmpty icon={<Trophy className="h-6 w-6" />} text="Scorer rankings will appear after the first recorded goals." />}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md sm:p-7">
          <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-4"><div className="rounded-lg bg-blue-100 p-2 text-pl-blue"><Award className="h-5 w-5" /></div><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-pl-blue-accent">Creative leaderboard</p><h2 className="font-display text-2xl uppercase text-pl-black">Assists</h2></div></div>
          {topAssists.length ? <ol>{topAssists.map((entry, index) => <RankingRow key={entry.player.id} rank={index + 1} {...entry} label={entry.value === 1 ? 'assist' : 'assists'} />)}</ol> : <RankingEmpty icon={<Award className="h-6 w-6" />} text="Assist rankings will appear after the first recorded assists." />}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md sm:p-7">
          <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-4"><div className="rounded-lg bg-blue-100 p-2 text-pl-blue"><ShieldCheck className="h-5 w-5" /></div><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-pl-blue-accent">Goalkeeper leaderboard</p><h2 className="font-display text-2xl uppercase text-pl-black">Clean sheets</h2></div></div>
          {cleanSheetRanking.length ? <ol>{cleanSheetRanking.map((entry, index) => <RankingRow key={entry.player.id} rank={index + 1} {...entry} label={entry.value === 1 ? 'clean sheet' : 'clean sheets'} />)}</ol> : <RankingEmpty icon={<ShieldCheck className="h-6 w-6" />} text="Clean-sheet rankings will appear after a goalkeeper records a shutout." />}
          <p className="mt-4 border-t border-gray-100 pt-3 text-[11px] leading-relaxed text-gray-500">A clean sheet is credited to the team’s first registered goalkeeper when that team concedes zero goals in a completed match.</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
        <div className="flex flex-col gap-2 border-b border-gray-200 bg-pl-blue px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="flex items-center gap-2"><Award className="h-5 w-5 text-amber-300" /><h2 className="font-display text-2xl uppercase">Team captains</h2></div><span className="text-xs font-bold uppercase tracking-wider text-white/70">{teams.length} departments · official leadership</span></div>
        {dataLoading ? <div className="p-12 text-center text-sm text-gray-500">Loading team captains…</div> : <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">{teams.map((team, index) => <motion.div key={team.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2, delay: Math.min(index * .04, .3) }} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:-translate-y-1 hover:border-pl-blue/30 hover:bg-blue-50/60 hover:shadow-md"><div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-pl-blue/[.04] transition-colors group-hover:bg-pl-blue/[.08]" /><Link href={`/teams/${team.code.toLowerCase()}`} className="relative z-10 flex items-center gap-3"><div className="relative h-14 w-14 shrink-0 rounded-full bg-white p-2 shadow-sm ring-1 ring-gray-200 transition-transform group-hover:scale-105"><Image src={team.badgeUrl} alt={`${team.name} logo`} fill className="object-contain p-1" /></div><div className="min-w-0"><span className="block font-display text-xl text-pl-blue">{team.code}</span><span className="block truncate text-[10px] font-bold uppercase tracking-wide text-gray-500">{team.department}</span></div></Link><div className="relative z-10 mt-4 border-t border-gray-200/80 pt-3"><p className="text-[9px] font-black uppercase tracking-[.16em] text-pl-blue-accent">Official captain</p><p className="mt-1 text-sm font-bold leading-snug text-gray-900">{team.captainName}</p></div></motion.div>)}</div>}
      </section>
    </div>
  );
}

function RankingEmpty({ icon, text }: { icon: ReactNode; text: string }) {
  return <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 text-center text-gray-400"><div className="mb-2">{icon}</div><p className="max-w-xs text-xs leading-relaxed">{text}</p></div>;
}
