"use client";

import Image from 'next/image';
import { useLayoutEffect, useState } from 'react';

export default function IntroLogoReveal() {
  const [visible, setVisible] = useState(true);
  useLayoutEffect(() => {
    if (window.sessionStorage.getItem('poly-league-intro-seen')) {
      setVisible(false);
      return;
    }
    window.sessionStorage.setItem('poly-league-intro-seen', 'true');
    const timer = window.setTimeout(() => setVisible(false), 1720);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return (
    <div className="intro-reveal pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-pl-blue" aria-hidden="true">
      <div className="absolute inset-0 bg-diagonal-pattern opacity-20" />
      <div className="intro-flash absolute inset-0 bg-white" />
      <div className="intro-pitch-line absolute left-1/2 top-1/2 h-[150vmax] w-px -translate-x-1/2 -translate-y-1/2 bg-white/25" />
      <div className="relative flex flex-col items-center gap-3 text-white">
        <div className="intro-ball-ring absolute h-36 w-36 rounded-full border border-amber-300/60 sm:h-44 sm:w-44" />
        <div className="intro-reveal-mark relative h-20 w-20 rounded-full bg-white p-2 shadow-2xl sm:h-24 sm:w-24"><Image src="/assets/Logo_polyleague.png" alt="" fill className="object-contain p-1" priority /></div>
        <div className="intro-reveal-mark text-center"><p className="font-display text-xl tracking-wide sm:text-2xl">POLY LEAGUE</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[.3em] text-amber-300">Kickoff · Season 2026</p></div>
      </div>
    </div>
  );
}
