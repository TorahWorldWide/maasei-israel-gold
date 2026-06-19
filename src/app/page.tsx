import Link from "next/link";
import { getApprovedEntries } from "@/lib/data";
import Feed from "@/components/Feed";

export const dynamic = "force-dynamic";

export default async function Home() {
  const entries = await getApprovedEntries();

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-[rgba(212,175,55,0.2)] text-[#f5f0e6] sticky top-0 z-40 shadow-[0_2px_24px_rgba(0,0,0,0.7)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#d4af37] tracking-tight">
            מעשי ישראל
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/submit"
              className="bg-[#d4af37] text-[#0a0a0a] font-semibold px-4 py-2 rounded-full hover:bg-[#f0d98c] transition-colors"
            >
              שלחו מעשה טוב
            </Link>
            <Link
              href="/admin"
              className="text-[#f5f0e6]/35 hover:text-[#f5f0e6]/80 transition-colors text-xs"
            >
              ניהול
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#0a0a0a] via-[#0f0d06] to-[#0a0a0a] text-[#f5f0e6] overflow-hidden border-b border-[rgba(212,175,55,0.1)]">
        {/* Faint Menorah watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 100 115"
            className="w-[520px] h-[520px] opacity-[0.055]"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <p className="text-[#d4af37]/65 text-sm font-medium uppercase tracking-widest mb-4">
            — תיעוד של מעשים טובים —
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight text-[#d4af37]">
            מעשי ישראל
          </h1>

          {/* Gold ornamental divider */}
          <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#d4af37]/70" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
          </div>

          <p className="text-lg md:text-xl text-[#f5f0e6]/75 max-w-2xl mx-auto leading-relaxed mb-3">
            אוסף מתועד של מעשים טובים, המצאות ותרומות של עם ישראל לעולם —
            כל פריט עם הוכחה.
          </p>
          <p className="text-sm text-[#d4af37]/55 flex items-center justify-center gap-1.5 mb-8">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            כל פריט כולל קישור מקור מאומת
          </p>
          <Link
            href="/submit"
            className="inline-block bg-[#d4af37] text-[#0a0a0a] font-bold px-8 py-3 rounded-full hover:bg-[#f0d98c] transition-colors text-lg shadow-[0_0_32px_rgba(212,175,55,0.25)]"
          >
            שלחו מעשה טוב ←
          </Link>
        </div>
      </section>

      {/* Feed */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
        <Feed entries={entries} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(212,175,55,0.12)] bg-[#0a0a0a] py-6 text-center text-sm text-[#f5f0e6]/25">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-1">
          <p>
            מעשי ישראל &mdash;{" "}
            <span className="font-medium text-[#d4af37]/60">{entries.length}</span>{" "}
            פריטים מתועדים
          </p>
          <p className="text-xs">
            <Link
              href="/admin"
              className="hover:text-[#d4af37]/50 transition-colors"
            >
              כניסת מנהל
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
