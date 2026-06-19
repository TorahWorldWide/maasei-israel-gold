"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Entry } from "@/lib/data";

function normalizeVideoUrl(url: string): string {
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return url;
}

interface SlideshowProps {
  entries: Entry[];
  initialIndex?: number;
  onClose: () => void;
}

export default function Slideshow({
  entries,
  initialIndex = 0,
  onClose,
}: SlideshowProps) {
  const [index, setIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const entry = entries[index];

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? entries.length - 1 : i - 1));
  }, [entries.length]);

  const next = useCallback(() => {
    setIndex((i) => (i === entries.length - 1 ? 0 : i + 1));
  }, [entries.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) prev();
    else if (dx < -50) next();
    touchStartX.current = null;
  };

  if (!entry) return null;

  const embedUrl =
    entry.media_type === "video_embed" && entry.media_url
      ? normalizeVideoUrl(entry.media_url)
      : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#060606] flex flex-col items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="מצגת מעשים טובים"
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="סגור"
        className="absolute top-4 left-4 z-10 text-[#d4af37]/60 hover:text-[#d4af37] bg-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.2)] rounded-full p-2.5 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute top-5 right-5 text-[#d4af37]/40 text-sm tabular-nums">
        {index + 1} / {entries.length}
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl px-6 md:px-12 flex flex-col gap-6">
        {/* Media */}
        {embedUrl ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-[rgba(212,175,55,0.18)]">
            <iframe
              src={embedUrl}
              title={entry.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        ) : entry.media_url && entry.media_type === "video_upload" ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-[rgba(212,175,55,0.18)]">
            <video
              src={entry.media_url}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        ) : entry.media_url && entry.media_type === "image" ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-[rgba(212,175,55,0.18)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.media_url}
              alt={entry.title}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0d0d0d] ring-1 ring-[rgba(212,175,55,0.18)] flex items-center justify-center">
            <svg
              viewBox="0 0 100 115"
              className="w-32 h-32 opacity-25"
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 110 L78 110" />
              <path d="M40 110 L40 102 L60 102 L60 110" />
              <line x1="50" y1="102" x2="50" y2="12" />
              <path d="M50 82 Q42 65 38 12" />
              <path d="M50 82 Q58 65 62 12" />
              <path d="M50 72 Q32 55 24 12" />
              <path d="M50 72 Q68 55 76 12" />
              <path d="M50 62 Q22 45 12 12" />
              <path d="M50 62 Q78 45 88 12" />
              <line x1="9" y1="12" x2="15" y2="12" />
              <line x1="21" y1="12" x2="27" y2="12" />
              <line x1="35" y1="12" x2="41" y2="12" />
              <line x1="47" y1="12" x2="53" y2="12" />
              <line x1="59" y1="12" x2="65" y2="12" />
              <line x1="73" y1="12" x2="79" y2="12" />
              <line x1="85" y1="12" x2="91" y2="12" />
            </svg>
          </div>
        )}

        {/* Text */}
        <div className="text-[#f5f0e6] text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-xs bg-[rgba(212,175,55,0.12)] text-[#d4af37] border border-[rgba(212,175,55,0.3)] px-3 py-1 rounded-full">
              {entry.category}
            </span>
            {entry.year && (
              <span className="text-[#f5f0e6]/30 text-sm">{entry.year}</span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-snug text-[#d4af37]">
            {entry.title}
          </h2>
          <p className="text-[#f5f0e6]/68 text-base md:text-lg leading-relaxed max-w-2xl mx-auto line-clamp-4">
            {entry.description}
          </p>
          <a
            href={entry.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-[#d4af37]/65 hover:text-[#d4af37] text-sm underline underline-offset-2 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            מקור: {entry.source_label || entry.source_url}
          </a>
        </div>
      </div>

      {/* Prev (RTL: right side = previous) */}
      <button
        onClick={prev}
        aria-label="הקודם"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-[#d4af37]/50 hover:text-[#d4af37] bg-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.2)] rounded-full p-3 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Next (RTL: left side = next) */}
      <button
        onClick={next}
        aria-label="הבא"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-[#d4af37]/50 hover:text-[#d4af37] bg-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.2)] rounded-full p-3 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}
