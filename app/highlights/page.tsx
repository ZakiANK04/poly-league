"use client";

import React from 'react';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { useTournament } from '@/lib/tournament-context';

export default function HighlightsPage() {
  const { publishedHighlights: highlights } = useTournament();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="relative bg-pl-blue text-white rounded-2xl p-6 sm:p-10 overflow-hidden shadow-lg border-b-4 border-pl-blue-accent">
        <div className="absolute inset-0 bg-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Legacy & Moments</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl uppercase italic tracking-wider text-white">
            LAST EDITION HIGHLIGHTS
          </h1>
          <p className="text-white/85 text-sm max-w-2xl leading-relaxed">
            Relive the greatest moments, clutch goals, and championship trophies from the previous Poly League tournament.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 flex flex-col hover:shadow-xl transition-shadow"
          >
              <div className="relative h-48 bg-pl-blue/10 flex items-center justify-center p-4">
              {item.contentType === 'score' ? (
                <div className="text-center">
                  <span className="font-display text-5xl text-pl-blue">{item.scoreline || 'VS'}</span>
                  <span className="block text-xs font-bold uppercase tracking-widest text-pl-blue-accent mt-2">Live score update</span>
                </div>
              ) : item.mediaType === 'video' ? (
                <video src={item.mediaUrl} controls className="h-full w-full object-cover" aria-label={item.title} />
              ) : (
                <Image src={item.mediaUrl} alt={item.caption || item.title} fill className="object-cover" />
              )}
              <span className="absolute top-3 right-3 bg-pl-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {item.season}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-display text-2xl text-pl-black leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  {item.caption || item.description}
                </p>
              </div>

              <div className="pt-4 flex flex-wrap gap-1.5 mt-4 border-t border-gray-100">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
