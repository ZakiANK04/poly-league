"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTournament } from '@/lib/tournament-context';

export default function StandingsTable({ compact = false }: { compact?: boolean }) {
  const { standings } = useTournament();

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 2) {
        return 'bg-pl-green text-white';
    }
    if (rank <= 6) {
        return 'bg-pl-amber text-white';
    }
    return 'bg-pl-red text-white';
  };

  return (
    <div className="space-y-4">
      {/* Desktop & Tablet Table */}
      <div className="hidden sm:block overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-pl-blue text-white text-xs uppercase tracking-wider font-display border-b-2 border-pl-blue-accent">
              <th className="py-4 px-4 text-center w-12 text-sm">#</th>
              <th className="py-4 px-4 text-sm">Team Department</th>
              <th className="py-4 px-3 text-center text-sm">MP</th>
              {!compact && (
                <>
                  <th className="py-4 px-3 text-center text-sm">W</th>
                  <th className="py-4 px-3 text-center text-sm">D</th>
                  <th className="py-4 px-3 text-center text-sm">L</th>
                </>
              )}
              <th className="py-4 px-3 text-center text-sm">GF</th>
              <th className="py-4 px-3 text-center text-sm">GA</th>
              <th className="py-4 px-3 text-center text-sm">GD</th>
              <th className="py-4 px-5 text-center font-bold text-amber-300 text-base">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm font-medium">
            {standings.map((row, idx) => (
              <motion.tr
                key={row.team.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                className="hover:bg-blue-50/70 transition-colors group"
              >
                {/* Rank Pill */}
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-md font-display text-base font-bold shadow-sm ${getRankBadgeColor(
                      row.rank
                    )}`}
                  >
                    {row.rank}
                  </span>
                </td>

                {/* Team Badge & Name */}
                <td className="py-3.5 px-4">
                  <Link
                    href={`/teams/${row.team.code.toLowerCase()}`}
                    className="flex items-center gap-3.5"
                  >
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Image
                        src={row.team.badgeUrl}
                        alt={row.team.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-display text-xl text-pl-black group-hover:text-pl-blue block leading-none">
                        {row.team.code}
                      </span>
                      <span className="text-xs text-gray-500 font-medium block mt-0.5">
                        {row.team.department}
                      </span>
                    </div>
                  </Link>
                </td>

                {/* MP */}
                <td className="py-3.5 px-3 text-center font-bold text-gray-800">
                  {row.mp}
                </td>

                {!compact && (
                  <>
                    <td className="py-3.5 px-3 text-center text-gray-600">{row.w}</td>
                    <td className="py-3.5 px-3 text-center text-gray-600">{row.d}</td>
                    <td className="py-3.5 px-3 text-center text-gray-600">{row.l}</td>
                  </>
                )}

                <td className="py-3.5 px-3 text-center text-gray-700">{row.gf}</td>
                <td className="py-3.5 px-3 text-center text-gray-700">{row.ga}</td>
                <td className="py-3.5 px-3 text-center font-bold">
                  <span
                    className={
                      row.gd > 0
                        ? 'text-emerald-600'
                        : row.gd < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }
                  >
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </span>
                </td>

                {/* Points: Bold Blue */}
                <td className="py-3.5 px-5 text-center font-display text-2xl text-pl-blue-accent font-bold">
                  {row.points}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-2.5">
        {standings.map((row) => (
          <div
            key={row.team.id}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 flex items-center justify-between gap-2 min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span
                className={`w-7 h-7 rounded-md flex items-center justify-center font-display text-base font-bold shadow-sm ${getRankBadgeColor(
                  row.rank
                )}`}
              >
                {row.rank}
              </span>
              <div className="relative w-11 h-11 flex-shrink-0">
                <Image
                  src={row.team.badgeUrl}
                  alt={row.team.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="font-display text-xl block leading-none">{row.team.code}</span>
                <span className="text-[11px] text-gray-500 block truncate max-w-[130px]">{row.team.department}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-right shrink-0">
              <div className="text-xs text-gray-500">
                <div>MP: <span className="font-bold text-gray-800">{row.mp}</span></div>
                <div>GD: <span className="font-bold text-gray-800">{row.gd > 0 ? `+${row.gd}` : row.gd}</span></div>
              </div>
              <div className="bg-pl-blue/10 px-2 py-1 rounded-lg font-display text-xl text-pl-blue-accent font-bold whitespace-nowrap">
                {row.points} PTS
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Outcome Zones Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-2 text-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-pl-green" />
          <span>Qualifies Directly to Final Phase Semi-Finals (1st–2nd)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-pl-amber" />
          <span>Enters Play-offs Round (3rd–6th)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-pl-red" />
          <span>Eliminated at End of League Phase (7th–8th)</span>
        </div>
      </div>
    </div>
  );
}
