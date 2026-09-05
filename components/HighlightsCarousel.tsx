"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Newspaper } from 'lucide-react';
import { useTournament } from '@/lib/tournament-context';
import HighlightMedia from '@/components/HighlightMedia';

export default function HighlightsCarousel() {
  const { publishedHighlights, dataLoading } = useTournament();
  const highlights = publishedHighlights.slice(0, 3);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(highlights.length - 1, 0)));
  }, [highlights.length]);

  useEffect(() => {
    if (highlights.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % highlights.length), 7000);
    return () => window.clearInterval(timer);
  }, [highlights.length]);

  if (dataLoading || !highlights.length) return null;
  const current = highlights[index];
  const previous = () => setIndex((currentIndex) => (currentIndex - 1 + highlights.length) % highlights.length);
  const next = () => setIndex((currentIndex) => (currentIndex + 1) % highlights.length);

  return <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div className="section-rule"><div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pl-blue-accent"><Newspaper className="h-4 w-4" /> From the archive</div><h2 className="mt-1 font-display text-3xl text-pl-black sm:text-4xl">Latest highlights</h2></div><Link href="/highlights" className="inline-flex min-h-11 items-center gap-1 text-xs font-bold uppercase tracking-wider text-pl-blue-accent hover:text-pl-blue">View all highlights <ArrowRight className="h-4 w-4" /></Link></div>
    <article className="relative grid overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg md:grid-cols-2">
      <div className="relative aspect-video min-h-64 bg-pl-blue/10 md:min-h-full"><HighlightMedia item={current} /></div>
      <div className="flex flex-col justify-center p-6 sm:p-9"><span className="text-[10px] font-bold uppercase tracking-[.18em] text-pl-blue-accent">{current.season}</span><h3 className="mt-2 font-display text-3xl uppercase leading-none text-pl-black sm:text-4xl">{current.title}</h3><p className="mt-4 text-sm leading-relaxed text-gray-600">{current.caption || current.description}</p><div className="mt-5 flex flex-wrap gap-1.5">{current.tags.map((tag) => <span key={tag} className="rounded bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600">#{tag}</span>)}</div></div>
      {highlights.length > 1 && <><button onClick={previous} aria-label="Previous highlight" className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-pl-blue shadow"><ArrowLeft className="h-5 w-5" /></button><button onClick={next} aria-label="Next highlight" className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-pl-blue shadow"><ArrowRight className="h-5 w-5" /></button><div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">{highlights.map((highlight, itemIndex) => <button key={highlight.id} onClick={() => setIndex(itemIndex)} aria-label={`Show ${highlight.title}`} className={`h-2.5 rounded-full ${index === itemIndex ? 'w-7 bg-pl-blue' : 'w-2.5 bg-white/80'}`} />)}</div></>}
    </article>
  </section>;
}
