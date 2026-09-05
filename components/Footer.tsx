import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Instagram } from 'lucide-react';
import { TEAMS } from '@/lib/mock-data';

export default function Footer() {
  return (
    <footer className="bg-pl-blue text-white mt-10 border-t-4 border-pl-blue-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Column 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white rounded-full p-1 shadow">
                <Image
                  src="/assets/Logo_polyleague.png"
                  alt="Poly League"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="font-sakana text-xl italic tracking-wider">POLY LEAGUE</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              The premier annual football competition uniting 8 departments in a high-octane UCL-style group stage and knockout championship.
            </p>
          </div>

          {/* Column 2: Competing Teams */}
          <div className="space-y-3 md:col-span-2">
            <h3 className="font-rugen text-lg tracking-wide uppercase italic text-amber-300">
              Competing Departments
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEAMS.map((team) => (
                <Link
                  key={team.id}
                  href={`/teams/${team.code.toLowerCase()}`}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/15 p-1.5 rounded transition border border-white/10 group"
                >
                  <div className="relative w-6 h-6 flex-shrink-0">
                    <Image
                      src={team.badgeUrl}
                      alt={team.name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="truncate">
                    <span className="font-rugen text-xs block text-white">{team.code}</span>
                    <span className="text-[10px] text-white/60 truncate block">{team.department}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h3 className="font-rugen text-lg tracking-wide uppercase italic text-amber-300">
              Tournament Portal
            </h3>
            <ul className="space-y-1.5 text-xs text-white/80">
              <li><Link href="/standings" className="hover:text-white hover:underline">Live League Standings</Link></li>
              <li><Link href="/fixtures" className="hover:text-white hover:underline">Matchday Fixtures</Link></li>
              <li><Link href="/bracket" className="hover:text-white hover:underline">Finals Knockout Bracket</Link></li>
              <li><Link href="/captains" className="hover:text-white hover:underline">Captains Directory</Link></li>
              <li><Link href="/rules" className="hover:text-white hover:underline">Official Competition Rules</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 text-center text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Poly League. Organized autonomously by the 8 Department Captains.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
            <a href="https://www.instagram.com/poly.league/" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-white/80 transition hover:text-amber-300" aria-label="Follow Poly League on Instagram"><Instagram className="h-4 w-4" /> Instagram</a>
            <a href="https://github.com/ZakiANK04" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-white/80 transition hover:text-amber-300" aria-label="Visit ZakiANK04 on GitHub"><Github className="h-4 w-4" /> GitHub</a>
            <span>Powered by Next.js & Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
