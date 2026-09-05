"use client";

import Image from 'next/image';
import { HighlightItem } from '@/lib/types';

function embeddedVideoUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '');
    if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1).split('/')[0]}`;
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v') || parsed.pathname.match(/\/(?:shorts|embed)\/([^/?]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
      const id = parsed.pathname.match(/\/video\/(\d+)/)?.[1];
      return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
    }
  } catch {}
  return null;
}

export default function HighlightMedia({ item, className = '' }: { item: HighlightItem; className?: string }) {
  const embedUrl = item.mediaType === 'video' ? embeddedVideoUrl(item.mediaUrl) : null;

  if (embedUrl) {
    return <iframe src={embedUrl} title={item.title} className={`h-full w-full border-0 ${className}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />;
  }

  if (item.mediaType === 'video') {
    return <video src={item.mediaUrl} controls className={`h-full w-full object-cover ${className}`} aria-label={item.title} />;
  }

  return <Image src={item.mediaUrl} alt={item.caption || item.title} fill className={`object-cover ${className}`} sizes="(max-width: 768px) 100vw, 33vw" />;
}
