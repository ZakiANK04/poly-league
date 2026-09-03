"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Radio } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const navLinks = [
    { href: '/', label: 'Home' }, { href: '/standings', label: 'Standings' },
    { href: '/fixtures', label: 'Fixtures' }, { href: '/bracket', label: 'Knockout' },
    { href: '/teams', label: 'Teams' }, { href: '/captains', label: 'Captains' },
    { href: '/rules', label: 'Format & Rules' }, { href: '/highlights', label: 'Highlights' },
  ];
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-pl-blue text-white shadow-lg">
      <div className="mx-auto flex min-h-[4.25rem] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-h-11 shrink-0 items-center gap-3" aria-label="Poly League home">
          <div className="relative h-9 w-9 rounded-full bg-white p-1 shadow-md transition-transform group-hover:scale-105">
            <Image src="/assets/Logo_polyleague.png" alt="Poly League crest" fill className="object-contain p-0.5" priority />
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="font-display text-lg uppercase italic leading-none tracking-wide">Poly League</span>
            <span className="mt-1 text-[8px] font-bold uppercase tracking-[.18em] text-amber-300">Season 2026 · Official portal</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center rounded-md px-2.5 text-[11px] font-bold uppercase tracking-wide transition-colors ${isActive(link.href) ? 'bg-white text-pl-blue shadow-sm' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80"><Radio className="h-3 w-3 text-amber-300" /> Pre-season</span>
        </div>
        <button type="button" onClick={() => setMobileOpen((open) => !open)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-white hover:bg-white/10 focus:outline-none xl:hidden" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="mobile-navigation">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileOpen && <div id="mobile-navigation" className="border-t border-white/10 bg-[#030477] px-4 pb-5 pt-3 xl:hidden" role="dialog" aria-label="Mobile navigation">
        <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[.16em] text-amber-300"><span>Season 2026</span><span>Pre-season</span></div>
        <nav className="grid gap-1" aria-label="Mobile navigation links">
          {navLinks.map((link) => <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined} className={`flex min-h-12 items-center rounded-lg px-4 text-sm font-bold uppercase tracking-wider ${isActive(link.href) ? 'bg-white text-pl-blue' : 'text-white/90 hover:bg-white/10'}`}>{link.label}</Link>)}
        </nav>
      </div>}
    </header>
  );
}
