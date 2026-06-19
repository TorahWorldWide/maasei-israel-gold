"use client";

import { useState, useMemo } from "react";
import type { Entry } from "@/lib/data";
import EntryCard from "./EntryCard";
import Slideshow from "./Slideshow";

const CATEGORIES = ["הכל", "חסד", "המצאה מדעית", "תרומה לעולם", "היסטורי"] as const;
const ERAS = ["הכל", "עתיק", "טרום המדינה", "המאה ה-20", "עכשווי"] as const;

function getEra(year: number | null): string {
  if (!year) return "עתיק";
  if (year < 1900) return "עתיק";
  if (year < 1948) return "טרום המדינה";
  if (year < 2000) return "המאה ה-20";
  return "עכשווי";
}

interface FeedProps {
  entries: Entry[];
}

export default function Feed({ entries }: FeedProps) {
  const [category, setCategory] = useState("הכל");
  const [era, setEra] = useState("הכל");
  const [search, setSearch] = useState("");
  const [slideshowIndex, setSlideshowIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (category !== "הכל" && e.category !== category) return false;
      if (era !== "הכל" && getEra(e.year) !== era) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !e.title.toLowerCase().includes(q) &&
          !e.description.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [entries, category, era, search]);

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search */}
        <div className="relative max-w-sm">
          <input
            type="search"
            placeholder="חיפוש..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-full border border-[rgba(212,175,55,0.3)] bg-[#161616] text-sm text-[#f5f0e6] placeholder:text-[#f5f0e6]/28 focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,0.25)] focus:border-[rgba(212,175,55,0.65)] transition-shadow"
            aria-label="חיפוש פריטים"
          />
          <svg
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]/45 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
            />
          </svg>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="סינון לפי קטגוריה">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                category === cat
                  ? "bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] shadow-[0_0_14px_rgba(212,175,55,0.28)]"
                  : "bg-transparent text-[#d4af37]/65 border-[rgba(212,175,55,0.32)] hover:border-[rgba(212,175,55,0.65)] hover:text-[#d4af37]"
              }`}
              aria-pressed={category === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Era chips */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="סינון לפי תקופה">
          {ERAS.map((e) => (
            <button
              key={e}
              onClick={() => setEra(e)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                era === e
                  ? "bg-[#c9a227] text-[#0a0a0a] border-[#c9a227]"
                  : "bg-transparent text-[#d4af37]/55 border-[rgba(212,175,55,0.28)] hover:border-[rgba(212,175,55,0.6)] hover:text-[#d4af37]/85"
              }`}
              aria-pressed={era === e}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {search.trim() && (
        <p className="text-sm text-[#f5f0e6]/38 mb-5">
          {filtered.length} תוצאות עבור &ldquo;{search}&rdquo;
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#f5f0e6]/28">
          <p className="text-lg">לא נמצאו פריטים.</p>
          <button
            onClick={() => {
              setCategory("הכל");
              setEra("הכל");
              setSearch("");
            }}
            className="mt-3 text-[#d4af37]/65 hover:text-[#d4af37] text-sm underline"
          >
            נקה סינון
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((entry, i) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onClick={() => setSlideshowIndex(i)}
            />
          ))}
        </div>
      )}

      {/* Slideshow overlay */}
      {slideshowIndex !== null && (
        <Slideshow
          entries={filtered}
          initialIndex={slideshowIndex}
          onClose={() => setSlideshowIndex(null)}
        />
      )}
    </>
  );
}
