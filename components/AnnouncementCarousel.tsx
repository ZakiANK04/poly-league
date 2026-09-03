"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { ANNOUNCEMENTS } from '@/lib/mock-data';
import { useTournament } from '@/lib/tournament-context';

export default function AnnouncementCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { publishedHighlights, matches } = useTournament();
  const dynamicSlides = [
    ...publishedHighlights.slice(0, 3).map((item) => ({ id: item.id, tag: 'LATEST HIGHLIGHT', title: item.title, subtitle: item.season, content: item.caption || item.description, date: 'Published update' })),
    ...matches.filter((match) => match.status === 'live' || match.status === 'finished').slice(0, 2).map((match) => ({ id: `match-${match.id}`, tag: 'MATCH UPDATE', title: `${match.homeTeam.code} ${match.homeScore ?? '-'} — ${match.awayScore ?? '-'} ${match.awayTeam.code}`, subtitle: match.roundLabel || 'Match update', content: `The latest official result is now available in Fixtures and Standings.`, date: 'Live tournament data' })),
  ];
  const slides = [...dynamicSlides, ...ANNOUNCEMENTS];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 9000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentIndex] || ANNOUNCEMENTS[0];

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-pl-blue-accent font-bold text-xs uppercase tracking-widest">
          <Bell className="w-4 h-4" />
          <span>Official Announcements</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl uppercase italic text-pl-black mt-1">
          LATEST TOURNAMENT NOTICES
        </h2>
      </div>

      {/* Announcement Card Container */}
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header Bar */}
        <div className="relative bg-pl-blue text-white px-6 py-4 flex items-center justify-between border-b-4 border-pl-blue-accent">
          <div className="absolute inset-0 bg-diagonal-pattern opacity-20 pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <span className="font-display text-2xl sm:text-3xl tracking-wider uppercase text-white">
              {slide.tag}
            </span>
          </div>
          <div className="relative flex items-center gap-2">
            <div className="relative w-9 h-9">
              <Image
                src="/assets/Logo_polyleague.png"
                alt="Poly League"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Body with AnimatePresence */}
        <div className="relative p-6 sm:p-10 text-center bg-[#FAFAFA] min-h-[250px] flex flex-col justify-center items-center overflow-hidden">
          <div className="absolute inset-0 bg-diagonal-pattern opacity-5 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="space-y-3 max-w-xl mx-auto"
            >
              <span className="text-xs font-bold text-pl-blue-accent uppercase tracking-widest block">
                {slide.subtitle}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl uppercase italic text-pl-black leading-tight">
                {slide.title}
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-normal">
                {slide.content}
              </p>
              <div className="pt-2">
                <span className="inline-block text-[11px] font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {slide.date}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-pl-blue shadow-lg border border-gray-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-pl-blue shadow-lg border border-gray-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dot Pagination */}
        <div className="bg-white py-3 border-t border-gray-100 flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all ${
                currentIndex === idx
                  ? 'w-8 bg-pl-blue'
                  : 'w-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
