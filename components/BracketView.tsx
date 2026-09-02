"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, Shuffle, Sparkles } from 'lucide-react';
import { useTournament } from '@/lib/tournament-context';

export default function BracketView() {
  const { knockoutDraw } = useTournament();

  const isDrawn = knockoutDraw.isDrawn;

  return (
    <div className="space-y-8">
      {/* Notice Banner */}
      {!isDrawn ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-300 shadow-sm max-w-3xl mx-auto text-center space-y-2"
        >
          <div className="inline-flex p-2.5 bg-amber-200 text-amber-900 rounded-full mb-1">
            <Shuffle className="w-5 h-5 animate-spin" />
          </div>
          <h3 className="font-display text-2xl text-amber-950 uppercase italic tracking-wide">
            OFFICIAL KNOCKOUT DRAW PENDING
          </h3>
          <p className="text-xs sm:text-sm text-amber-900/80 max-w-xl mx-auto leading-relaxed">
            The official knockout pairings will be drawn and randomized live by the 8 department captains through their confidential portal at the end of the League Phase. Below is the structural competition tree.
          </p>
        </motion.div>
      ) : (
        <div className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-400 max-w-3xl mx-auto text-center space-y-1">
          <div className="inline-flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Official Knockout Draw Locked & Confirmed</span>
          </div>
          <p className="text-xs text-emerald-700">
            Drawn on {new Date(knockoutDraw.drawnAt!).toLocaleDateString()} by Captain {knockoutDraw.drawnBy}
          </p>
        </div>
      )}

      {/* Bracket Tree */}
      <div className="overflow-x-auto pb-8">
        <div className="min-w-[800px] grid grid-cols-3 gap-6 items-center">
          {/* Column 1: Play-offs (3rd to 6th) */}
          <div className="space-y-6">
            <div className="badge-gold text-center py-2.5 px-4 rounded-xl font-display text-base shadow tracking-wider">
              PLAY OFF (3RD - 6TH PLACE)
            </div>

            <div className="space-y-4">
              {/* Play-off Match 1 */}
              <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-amber-300 space-y-3">
                <div className="text-[11px] font-bold text-gray-500 uppercase flex justify-between">
                  <span>PLAY-OFF 1</span>
                  <span className="text-pl-blue">Final phase</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      {isDrawn && knockoutDraw.playOff1 ? (
                        <>
                          <div className="relative w-8 h-8">
                            <Image src={knockoutDraw.playOff1.home.badgeUrl} alt="Team" fill className="object-contain" />
                          </div>
                          <span className="font-display text-lg">{knockoutDraw.playOff1.home.code}</span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-gray-500">Seed #3 in League Standings</span>
                      )}
                    </div>
                    <span className="font-display text-xl font-bold">{isDrawn && knockoutDraw.playOff1?.homeScore !== null ? knockoutDraw.playOff1?.homeScore : '-'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      {isDrawn && knockoutDraw.playOff1 ? (
                        <>
                          <div className="relative w-8 h-8">
                            <Image src={knockoutDraw.playOff1.away.badgeUrl} alt="Team" fill className="object-contain" />
                          </div>
                          <span className="font-display text-lg">{knockoutDraw.playOff1.away.code}</span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-gray-500">Seed #6 in League Standings</span>
                      )}
                    </div>
                    <span className="font-display text-xl font-bold">{isDrawn && knockoutDraw.playOff1?.awayScore !== null ? knockoutDraw.playOff1?.awayScore : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Play-off Match 2 */}
              <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-amber-300 space-y-3">
                <div className="text-[11px] font-bold text-gray-500 uppercase flex justify-between">
                  <span>PLAY-OFF 2</span>
                  <span className="text-pl-blue">Final phase</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      {isDrawn && knockoutDraw.playOff2 ? (
                        <>
                          <div className="relative w-8 h-8">
                            <Image src={knockoutDraw.playOff2.home.badgeUrl} alt="Team" fill className="object-contain" />
                          </div>
                          <span className="font-display text-lg">{knockoutDraw.playOff2.home.code}</span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-gray-500">Seed #4 in League Standings</span>
                      )}
                    </div>
                    <span className="font-display text-xl font-bold">{isDrawn && knockoutDraw.playOff2?.homeScore !== null ? knockoutDraw.playOff2?.homeScore : '-'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      {isDrawn && knockoutDraw.playOff2 ? (
                        <>
                          <div className="relative w-8 h-8">
                            <Image src={knockoutDraw.playOff2.away.badgeUrl} alt="Team" fill className="object-contain" />
                          </div>
                          <span className="font-display text-lg">{knockoutDraw.playOff2.away.code}</span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-gray-500">Seed #5 in League Standings</span>
                      )}
                    </div>
                    <span className="font-display text-xl font-bold">{isDrawn && knockoutDraw.playOff2?.awayScore !== null ? knockoutDraw.playOff2?.awayScore : '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Semi-Finals */}
          <div className="space-y-6">
            <div className="badge-gold text-center py-2.5 px-4 rounded-xl font-display text-base shadow tracking-wider">
              SEMI FINAL
            </div>

            <div className="space-y-4">
              {/* Semi-Final 1 */}
              <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-amber-400 space-y-3">
                <div className="text-[11px] font-bold text-gray-500 uppercase flex justify-between">
                  <span>SEMI-FINAL 1</span>
                  <span className="text-pl-blue">Final phase</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      {isDrawn && knockoutDraw.semiFinal1 ? (
                        <>
                          <div className="relative w-8 h-8">
                            <Image src={knockoutDraw.semiFinal1.home.badgeUrl} alt="Team" fill className="object-contain" />
                          </div>
                          <span className="font-display text-lg">{knockoutDraw.semiFinal1.home.code}</span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-gray-500">Seed #1 (Direct Qualifier)</span>
                      )}
                    </div>
                    <span className="font-display text-xl font-bold">-</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-gray-500">Winner Play-off 1</span>
                    </div>
                    <span className="font-display text-xl font-bold">-</span>
                  </div>
                </div>
              </div>

              {/* Semi-Final 2 */}
              <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-amber-400 space-y-3">
                <div className="text-[11px] font-bold text-gray-500 uppercase flex justify-between">
                  <span>SEMI-FINAL 2</span>
                  <span className="text-pl-blue">Final phase</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      {isDrawn && knockoutDraw.semiFinal2 ? (
                        <>
                          <div className="relative w-8 h-8">
                            <Image src={knockoutDraw.semiFinal2.home.badgeUrl} alt="Team" fill className="object-contain" />
                          </div>
                          <span className="font-display text-lg">{knockoutDraw.semiFinal2.home.code}</span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-gray-500">Seed #2 (Direct Qualifier)</span>
                      )}
                    </div>
                    <span className="font-display text-xl font-bold">-</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-gray-500">Winner Play-off 2</span>
                    </div>
                    <span className="font-display text-xl font-bold">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: The Grand Final */}
          <div className="space-y-6">
            <div className="badge-gold text-center py-2.5 px-4 rounded-xl font-display text-lg shadow flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-pl-blue" />
              <span>THE GRAND FINAL</span>
            </div>

            <div className="bg-gradient-to-b from-white to-amber-50 rounded-2xl p-6 shadow-xl border-4 border-amber-400 text-center space-y-4">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                Championship Showdown
              </div>

              <div className="flex items-center justify-center gap-4 py-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs font-bold text-gray-400">
                    SF 1
                  </div>
                  <span className="font-display text-base text-gray-600">Winner SF 1</span>
                </div>

                <div className="font-display text-3xl text-pl-blue-accent italic font-bold">
                  VS
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs font-bold text-gray-400">
                    SF 2
                  </div>
                  <span className="font-display text-base text-gray-600">Winner SF 2</span>
                </div>
              </div>

              <div className="badge-gold py-2 px-4 rounded-lg inline-block text-xs font-bold shadow">
                🏆 CHAMPIONSHIP TROPHY & GOLD MEDALS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
