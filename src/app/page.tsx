import Link from "next/link";
import { getApprovedEntries } from "@/lib/data";
import Feed from "@/components/Feed";
import Theater from "@/components/Theater";

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

      {/* Theater (auto-playing reel + emotional music) */}
      <Theater entries={entries} />

      {/* Catalog */}
      <main id="catalog" className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 scroll-mt-20">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#d4af37]">
            כל המעשים הטובים
          </h2>
          {/* Gold ornamental divider */}
          <div className="flex items-center justify-center gap-3 my-4" aria-hidden="true">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#d4af37]/70" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
          </div>
          <p className="text-[#f5f0e6]/55 text-sm">
            חפשו, סננו לפי קטגוריה ותקופה, וגלו אחד אחד — כל פריט עם מקור מאומת.
          </p>
        </div>
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
            <Link href="/admin" className="hover:text-[#d4af37]/50 transition-colors">
              כניסת מנהל
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
