"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Shield, ArrowLeft, Calendar, Users, AlertCircle } from 'lucide-react';
import { useTournament } from '@/lib/tournament-context';
import FixtureCard from '@/components/FixtureCard';

export default function TeamDetailPage() {
  const params = useParams();
  const code = (params?.code as string)?.toUpperCase();
  const { teams, players, matches } = useTournament();

  const team = teams.find((t) => t.code === code);
  if (!team) return notFound();

  const teamPlayers = players.filter((p) => p.teamId === team.id);
  const teamMatches = matches.filter(
    (m) => m.homeTeamId === team.id || m.awayTeamId === team.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/teams"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-pl-blue-accent hover:underline uppercase"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Teams</span>
      </Link>

      {/* Team Header Banner */}
      <div className="relative bg-pl-blue text-white rounded-2xl p-6 sm:p-10 overflow-hidden shadow-xl border-b-4 border-pl-blue-accent">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-2xl p-3 shadow-2xl flex-shrink-0">
            <Image
              src={team.badgeUrl}
              alt={team.name}
              fill
              className="object-contain p-2"
              priority
            />
          </div>
          <div className="space-y-2">
            <span className="font-display text-4xl sm:text-6xl uppercase italic tracking-wider block text-white leading-none">
              {team.code}
            </span>
            <p className="text-amber-300 font-bold text-lg sm:text-xl">
              {team.department}
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20 text-xs">
              <Shield className="w-4 h-4 text-amber-300" />
              <span>Team Captain: <strong>{team.captainName}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Squad Roster */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-200 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5 text-pl-blue">
            <Users className="w-5 h-5" />
            <h2 className="font-display text-2xl uppercase italic text-pl-black">
              OFFICIAL SQUAD ROSTER
            </h2>
          </div>
          <span className="text-xs text-gray-500 font-bold">
            {teamPlayers.length} Registered Players
          </span>
        </div>

        {teamPlayers.length === 0 ? (
          <div className="p-8 rounded-xl bg-gray-50 border border-dashed border-gray-300 text-center space-y-3">
            <div className="inline-flex p-3 bg-amber-100 text-amber-800 rounded-full">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-display text-xl text-gray-800 uppercase">
              SQUAD REGISTRATION IN PROGRESS
            </h4>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              Captain <strong>{team.captainName}</strong> has not finalized the official squad roster yet. As soon as the players are registered through the Captain Portal, their numbers and positions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teamPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 hover:bg-blue-50/50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-pl-blue text-white font-display text-lg flex items-center justify-center font-bold">
                    {player.number}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <span>{player.name}</span>
                      {player.isCaptain && (
                        <span className="bg-amber-400 text-pl-black text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                          CAPTAIN
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 font-semibold">
                      {player.position}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Fixtures & Results */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-pl-blue">
          <Calendar className="w-5 h-5" />
          <h2 className="font-display text-2xl uppercase italic text-pl-black">
            MATCH SCHEDULE & RESULTS
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMatches.map((m) => (
            <FixtureCard key={m.id} match={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
