"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Check, ClipboardCheck, Shield, Trophy, Users, X } from 'lucide-react';
import { MatchStatus } from '@/lib/types';
import { useTournament } from '@/lib/tournament-context';

export default function SuperAdminDashboard() {
  const { teams, players, matches, highlights, portalRole, currentCaptain, updateMatch, updateHighlight } = useTournament();
  const [activeView, setActiveView] = useState<'scores' | 'squads' | 'review'>('scores');

  if (portalRole !== 'super_admin') {
    return <div className="mx-auto max-w-xl px-4 py-20 text-center"><Shield className="mx-auto mb-4 h-10 w-10 text-pl-blue" /><h1 className="font-display text-3xl uppercase">Restricted workspace</h1><p className="mt-2 text-sm text-gray-600">This area is reserved for the tournament super admin.</p></div>;
  }

  const pendingHighlights = highlights.filter((item) => (item.approvalStatus || 'approved') === 'pending');

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6 lg:px-8">
      <header className="relative overflow-hidden rounded-xl bg-pl-blue p-5 text-white shadow-lg sm:p-7">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-15" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-amber-300"><Shield className="h-4 w-4" /> Super admin control room</div><h1 className="font-display text-4xl uppercase italic sm:text-5xl">Matchday command</h1><p className="mt-2 max-w-xl text-sm text-white/75">{currentCaptain?.name} has full review authority across every department.</p></div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wider"><div className="rounded-lg bg-white/10 px-3 py-2"><strong className="block font-display text-2xl text-amber-300">{teams.length}</strong>teams</div><div className="rounded-lg bg-white/10 px-3 py-2"><strong className="block font-display text-2xl text-amber-300">{players.length}</strong>players</div><div className="rounded-lg bg-white/10 px-3 py-2"><strong className="block font-display text-2xl text-amber-300">{pendingHighlights.length}</strong>pending</div></div>
        </div>
      </header>

      <nav className="flex gap-1 overflow-x-auto border-b border-gray-200" aria-label="Super admin sections">
        <AdminTab active={activeView === 'scores'} onClick={() => setActiveView('scores')} icon={<Trophy className="h-4 w-4" />}>Score control</AdminTab>
        <AdminTab active={activeView === 'squads'} onClick={() => setActiveView('squads')} icon={<Users className="h-4 w-4" />}>All squads</AdminTab>
        <AdminTab active={activeView === 'review'} onClick={() => setActiveView('review')} icon={<ClipboardCheck className="h-4 w-4" />}>Review queue ({pendingHighlights.length})</AdminTab>
      </nav>

      {activeView === 'scores' && <ScoreControl matches={matches} onUpdate={updateMatch} />}
      {activeView === 'squads' && <SquadOverview teams={teams} players={players} />}
      {activeView === 'review' && <ReviewQueue highlights={highlights} onReview={(id, status) => updateHighlight(id, { approvalStatus: status, reviewedBy: currentCaptain?.name, reviewedAt: new Date().toISOString() })} />}
    </div>
  );
}

function AdminTab({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return <button onClick={onClick} className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-xs font-bold uppercase tracking-wide transition ${active ? 'border-pl-blue text-pl-blue' : 'border-transparent text-gray-400 hover:text-gray-900'}`}>{icon}{children}</button>;
}

function ScoreControl({ matches, onUpdate }: { matches: ReturnType<typeof useTournament>['matches']; onUpdate: (id: string, updates: Parameters<ReturnType<typeof useTournament>['updateMatch']>[1]) => void }) {
  return <section className="grid gap-4 md:grid-cols-2">{matches.map((match) => <ScoreCard key={match.id} match={match} onUpdate={(updates) => onUpdate(match.id, updates)} />)}</section>;
}

function ScoreCard({ match, onUpdate }: { match: ReturnType<typeof useTournament>['matches'][number]; onUpdate: (updates: Parameters<ReturnType<typeof useTournament>['updateMatch']>[1]) => void }) {
  const [homeScore, setHomeScore] = useState(match.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(match.awayScore ?? 0);
  const [status, setStatus] = useState<MatchStatus>(match.status);
  const [saved, setSaved] = useState(false);
  const save = () => { onUpdate({ homeScore: status === 'scheduled' ? null : homeScore, awayScore: status === 'scheduled' ? null : awayScore, status }); setSaved(true); window.setTimeout(() => setSaved(false), 1800); };
  return <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-pl-blue"><span>{match.roundLabel || `Matchday ${match.matchday}`}</span><span className="text-gray-400">{match.venue || 'Venue TBD'}</span></div><div className="flex items-center justify-between gap-2"><div className="flex min-w-0 flex-1 items-center gap-2"><div className="relative h-9 w-9 shrink-0"><Image src={match.homeTeam.badgeUrl} alt="" fill className="object-contain" /></div><span className="font-display text-xl">{match.homeTeam.code}</span></div><div className="flex items-center gap-1"><input aria-label={`${match.homeTeam.code} score`} type="number" min="0" value={homeScore} onChange={(event) => setHomeScore(Number(event.target.value))} className="w-11 rounded-md border px-1 py-1 text-center font-display text-xl" disabled={status === 'scheduled'} /><span className="font-display text-lg text-gray-400">:</span><input aria-label={`${match.awayTeam.code} score`} type="number" min="0" value={awayScore} onChange={(event) => setAwayScore(Number(event.target.value))} className="w-11 rounded-md border px-1 py-1 text-center font-display text-xl" disabled={status === 'scheduled'} /></div><div className="flex min-w-0 flex-1 items-center justify-end gap-2"><span className="font-display text-xl">{match.awayTeam.code}</span><div className="relative h-9 w-9 shrink-0"><Image src={match.awayTeam.badgeUrl} alt="" fill className="object-contain" /></div></div></div><div className="mt-4 grid grid-cols-[1fr_auto] gap-2"><select value={status} onChange={(event) => setStatus(event.target.value as MatchStatus)} className="rounded-md border px-2 py-2 text-xs font-semibold"><option value="scheduled">Scheduled</option><option value="live">Live</option><option value="finished">Finished</option></select><button onClick={save} className={`flex items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-bold uppercase ${saved ? 'bg-emerald-600 text-white' : 'bg-pl-blue text-white hover:bg-pl-blue-accent'}`}>{saved ? <Check className="h-4 w-4" /> : <Trophy className="h-4 w-4" />} {saved ? 'Saved' : 'Save score'}</button></div></article>;
}

function SquadOverview({ teams, players }: { teams: ReturnType<typeof useTournament>['teams']; players: ReturnType<typeof useTournament>['players'] }) {
  return <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{teams.map((team) => { const teamPlayers = players.filter((player) => player.teamId === team.id); return <article key={team.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-3 border-b border-gray-100 pb-3"><div className="relative h-10 w-10"><Image src={team.badgeUrl} alt={team.name} fill className="object-contain" /></div><div><h2 className="font-display text-xl">{team.code}</h2><p className="text-[10px] text-gray-500">{team.department}</p></div></div><p className="mt-3 text-xs font-bold uppercase tracking-wider text-pl-blue">{teamPlayers.length} registered</p><ul className="mt-2 space-y-1 text-xs text-gray-700">{teamPlayers.length ? teamPlayers.map((player) => <li key={player.id} className="flex justify-between"><span>{player.name}</span><span className="text-gray-400">{player.position} · #{player.number}</span></li>) : <li className="text-gray-400">No players registered</li>}</ul></article>; })}</section>;
}

function ReviewQueue({ highlights, onReview }: { highlights: ReturnType<typeof useTournament>['highlights']; onReview: (id: string, status: 'approved' | 'rejected') => void }) {
  const pending = highlights.filter((item) => (item.approvalStatus || 'approved') === 'pending');
  if (!pending.length) return <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center"><ClipboardCheck className="mx-auto h-8 w-8 text-emerald-600" /><h2 className="mt-3 font-display text-2xl uppercase">Queue is clear</h2><p className="mt-1 text-sm text-gray-500">New admin submissions will appear here for review.</p></div>;
  return <section className="space-y-3">{pending.map((item) => <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="flex-1"><p className="text-[10px] font-bold uppercase tracking-wider text-pl-blue">{item.contentType || 'article'} · Submitted by {item.createdBy || 'captain'}</p><h2 className="mt-1 font-display text-2xl uppercase">{item.title}</h2><p className="mt-1 text-sm text-gray-600">{item.caption || item.description}</p></div><div className="flex shrink-0 gap-2"><button onClick={() => onReview(item.id, 'rejected')} className="flex items-center gap-1 rounded-md border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"><X className="h-4 w-4" /> Reject</button><button onClick={() => onReview(item.id, 'approved')} className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"><Check className="h-4 w-4" /> Approve</button></div></div></article>)}</section>;
}