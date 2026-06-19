"use client";

import type { Entry } from "@/lib/data";

function normalizeVideoUrl(url: string): string {
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return url;
}

function MenorahPlaceholder({ category }: { category: string }) {
  return (
    <div className="relative flex items-center justify-center w-full h-full bg-[#0d0d0d] overflow-hidden">
      <svg
        viewBox="0 0 100 115"
        className="absolute inset-0 w-full h-full p-8 opacity-20"
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
      <span className="relative z-10 text-[#d4af37] text-sm font-medium px-3 py-1 rounded-full border border-[rgba(212,175,55,0.4)] bg-[#0a0a0a]/70">
        {category}
      </span>
    </div>
  );
}

interface EntryCardProps {
  entry: Entry;
  onClick?: () => void;
}

export default function EntryCard({ entry, onClick }: EntryCardProps) {
  const embedUrl =
    entry.media_type === "video_embed" && entry.media_url
      ? normalizeVideoUrl(entry.media_url)
      : null;

  return (
    <div
      className="group bg-[#161616] rounded-2xl border border-[rgba(212,175,55,0.22)] overflow-hidden hover:border-[rgba(212,175,55,0.5)] hover:shadow-[0_0_24px_rgba(212,175,55,0.1)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col cursor-pointer"
      onClick={onClick}
      role="article"
    >
      {/* Media */}
      <div className="relative w-full aspect-video bg-[#0d0d0d] flex-shrink-0">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={entry.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
          />
        ) : entry.media_url && entry.media_type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.media_url}
            alt={entry.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <MenorahPlaceholder category={entry.category} />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full border border-[rgba(212,175,55,0.4)] text-[#d4af37]/90">
            {entry.category}
          </span>
          {entry.year && (
            <span className="text-xs text-[#f5f0e6]/30">{entry.year}</span>
          )}
        </div>

        <h3 className="text-lg font-bold text-[#d4af37] leading-snug line-clamp-2">
          {entry.title}
        </h3>

        <p className="text-sm text-[#f5f0e6]/60 leading-relaxed line-clamp-3 flex-1">
          {entry.description}
        </p>

        <a
          href={entry.source_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-[#d4af37]/65 hover:text-[#d4af37] font-medium flex items-center gap-1 underline underline-offset-2 decoration-[rgba(212,175,55,0.3)] hover:decoration-[rgba(212,175,55,0.7)] transition-colors mt-auto pt-1"
        >
          <svg
            className="w-3 h-3 flex-shrink-0"
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
  );
}
