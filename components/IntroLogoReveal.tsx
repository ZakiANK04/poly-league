"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function IntroLogoReveal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasSeenIntro = window.sessionStorage.getItem('poly-league-intro-seen');
    if (!hasSeenIntro) {
      setVisible(true);
      window.sessionStorage.setItem('poly-league-intro-seen', 'true');
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="intro-reveal fixed inset-0 z-[100] flex items-center justify-center bg-pl-blue pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-diagonal-pattern opacity-20" />
      <div className="relative flex flex-col items-center gap-4 text-white">
        <div className="intro-reveal-mark relative h-20 w-20 rounded-full bg-white p-2 shadow-2xl sm:h-28 sm:w-28">
          <Image src="/assets/Logo_polyleague.png" alt="Poly League" fill className="object-contain p-1" priority />
        </div>
        <div className="intro-reveal-mark text-center">
          <p className="font-sakana text-xl sm:text-2xl tracking-wide">POLY LEAGUE</p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-[.3em] text-amber-300">Season 2026</p>
        </div>
      </div>
    </div>
  );
}