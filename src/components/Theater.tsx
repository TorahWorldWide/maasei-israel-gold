"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import type { Entry } from "@/lib/data";

function ytId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

interface TheaterProps {
  entries: Entry[];
}

const ROTATE_MS = 22000;
const GOLD = "#d4af37";

function Menorah({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M60 30 V78" />
      <path d="M44 40 V52 C44 64 52 70 60 70" />
      <path d="M76 40 V52 C76 64 68 70 60 70" />
      <path d="M30 38 V52 C30 66 44 74 60 74" />
      <path d="M90 38 V52 C90 66 76 74 60 74" />
      <path d="M18 36 V52 C18 70 38 80 60 80" />
      <path d="M102 36 V52 C102 70 82 80 60 80" />
      <path d="M48 78 H72" />
      <path d="M44 84 H76" />
      {[18, 30, 44, 60, 76, 90, 102].map((x) => (
        <line key={x} x1={x} y1={x === 60 ? 30 : 36 - (Math.abs(60 - x) > 20 ? 0 : 2)} x2={x} y2={x === 60 ? 26 : 32} stroke={GOLD} strokeWidth="3.5" />
      ))}
    </svg>
  );
}

export default function Theater({ entries }: TheaterProps) {
  const featured = useMemo(() => {
    const vids = entries.filter(
      (e) =>
        (e.media_type === "video_embed" && ytId(e.media_url || "")) ||
        (e.media_type === "video_upload" && e.media_url)
    );
    if (vids.length) return vids;
    const media = entries.filter((e) => e.media_url);
    return media.length ? media : entries;
  }, [entries]);

  const [idx, setIdx] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = featured[idx];

  const go = useCallback(
    (dir: number) => {
      setIdx((i) => {
        const n = featured.length;
        if (!n) return 0;
        return (i + dir + n) % n;
      });
    },
    [featured.length]
  );

  const jump = useCallback((i: number) => setIdx(i), []);

  useEffect(() => {
    if (!current) return;
    if (current.media_type === "video_upload") return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => go(1), ROTATE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, idx, go]);

  const toggleMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (musicOn) {
      a.pause();
      setMusicOn(false);
    } else {
      a.volume = 0;
      a.play()
        .then(() => {
          setMusicOn(true);
          let v = 0;
          const id = setInterval(() => {
            v += 0.05;
            if (v >= 0.6) {
              v = 0.6;
              clearInterval(id);
            }
            a.volume = v;
          }, 120);
        })
        .catch(() => setMusicOn(false));
    }
  }, [musicOn]);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  if (!current) return null;

  const id = current.media_type === "video_embed" ? ytId(current.media_url || "") : null;
  const embedSrc = id
    ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${id}`
    : null;

  return (
    <section className="relative overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1505 0%, #0d0d0d 55%, #0a0a0a 100%)" }}>
      {/* faint menorah watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="opacity-[0.05] w-[620px] max-w-none">
          <Menorah className="w-full h-auto" />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10">
        {/* Title */}
        <div className="text-center mb-5">
          <p className="text-xs font-medium uppercase tracking-[0.25em] mb-2" style={{ color: "rgba(212,175,55,0.75)" }}>
            — מעשי ישראל —
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: GOLD }}>
            מעשים טובים של עם ישראל
          </h1>
        </div>

        {/* THEATER SCREEN */}
        <div className="relative mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl aspect-video" style={{ boxShadow: "0 25px 80px -20px rgba(212,175,55,0.35)", border: "1px solid rgba(212,175,55,0.35)" }}>
            {embedSrc ? (
              <iframe
                key={current.id}
                src={embedSrc}
                title={current.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : current.media_type === "video_upload" && current.media_url ? (
              <video
                key={current.id}
                src={current.media_url}
                autoPlay
                muted
                playsInline
                controls
                onEnded={() => go(1)}
                className="absolute inset-0 w-full h-full object-contain bg-black"
              />
            ) : current.media_url && current.media_type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current.media_url} alt={current.title} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#161616]">
                <Menorah className="w-28 h-28 opacity-40" />
              </div>
            )}

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4 md:p-5 pointer-events-none">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full backdrop-blur-sm" style={{ color: GOLD, background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)" }}>
                  {current.category}
                </span>
                {current.year && <span className="text-white/50 text-xs">{current.year}</span>}
              </div>
              <h2 className="text-white text-lg md:text-2xl font-bold leading-snug drop-shadow line-clamp-2">
                {current.title}
              </h2>
            </div>
          </div>

          {featured.length > 1 && (
            <>
              <button
                onClick={() => go(1)}
                aria-label="הקודם"
                className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 rounded-full p-2.5 md:p-3 backdrop-blur-sm transition-colors"
                style={{ background: "rgba(212,175,55,0.18)", color: GOLD }}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => go(-1)}
                aria-label="הבא"
                className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 rounded-full p-2.5 md:p-3 backdrop-blur-sm transition-colors"
                style={{ background: "rgba(212,175,55,0.18)", color: GOLD }}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="mt-5 flex flex-col items-center gap-4">
          {featured.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {featured.map((e, i) => (
                <button
                  key={e.id}
                  onClick={() => jump(i)}
                  aria-label={`עבור לסרטון ${i + 1}`}
                  className="h-2 rounded-full transition-all duration-200"
                  style={
                    i === idx
                      ? { width: "1.75rem", background: GOLD }
                      : { width: "0.5rem", background: "rgba(212,175,55,0.3)" }
                  }
                />
              ))}
            </div>
          )}

          <a
            href={current.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline underline-offset-2 transition-colors"
            style={{ color: GOLD }}
          >
            מקור: {current.source_label || current.source_url}
          </a>

          <button
            onClick={toggleMusic}
            className="group flex items-center gap-2.5 px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-lg"
            style={
              musicOn
                ? { background: GOLD, color: "#0a0a0a", boxShadow: "0 10px 30px -8px rgba(212,175,55,0.5)" }
                : { background: "rgba(212,175,55,0.14)", color: GOLD, border: `1px solid ${GOLD}` }
            }
          >
            {musicOn ? (
              <>
                <span className="flex items-end gap-0.5 h-4" aria-hidden="true">
                  <span className="w-1 rounded-full animate-pulse" style={{ height: "60%", background: "#0a0a0a" }} />
                  <span className="w-1 rounded-full animate-pulse" style={{ height: "100%", background: "#0a0a0a", animationDelay: "0.15s" }} />
                  <span className="w-1 rounded-full animate-pulse" style={{ height: "40%", background: "#0a0a0a", animationDelay: "0.3s" }} />
                </span>
                השתקת מוזיקה
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                נגן מוזיקה מרגשת
              </>
            )}
          </button>
          <p className="text-[11px]" style={{ color: "rgba(212,175,55,0.45)" }}>
            הסרטונים מתנגנים ללא קול — הפעל מוזיקה לחוויה מלאה
          </p>
        </div>

        <div className="mt-8 text-center">
          <a href="#catalog" className="inline-flex flex-col items-center transition-colors" style={{ color: "rgba(212,175,55,0.7)" }}>
            <span className="text-sm mb-1">כל המעשים — חפש, סנן, גלה</span>
            <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>

      <audio ref={audioRef} src="/audio/inspire.mp3" loop preload="none" />
    </section>
  );
}
