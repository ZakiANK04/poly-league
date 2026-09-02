"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/standings', label: 'Standings' },
    { href: '/fixtures', label: 'Fixtures' },
    { href: '/bracket', label: 'Knockout' },
    { href: '/teams', label: 'Teams' },
    { href: '/captains', label: 'Captains' },
    { href: '/rules', label: 'Format & Rules' },
    { href: '/highlights', label: 'Highlights' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-pl-blue text-white shadow-lg border-b-2 border-pl-blue-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[3rem] items-center justify-between py-1 overflow-visible">
          {/* Tournament Logo & Brand */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 bg-white rounded-full p-1 shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <Image
                src="/assets/Logo_polyleague.png"
                alt="Poly League"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-sakana text-xs sm:text-sm tracking-wide text-white uppercase italic leading-none">
                POLY LEAGUE
              </span>
              <span className="text-[6px] sm:text-[7px] text-amber-300 uppercase tracking-[.14em] font-bold mt-1">
                Official Tournament
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Public Spectators) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide transition-all ${
                  isActive(link.href)
                    ? 'bg-white text-pl-blue shadow-sm'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-white hover:text-white/80 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-pl-blue-dark border-t border-white/10 px-4 pt-3 pb-6 space-y-1 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-md text-base font-bold uppercase tracking-wider ${
                isActive(link.href)
                  ? 'bg-white text-pl-blue font-black'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}

        </div>
      )}
    </header>
  );
}
