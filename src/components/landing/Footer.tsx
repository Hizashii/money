"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6" style={{ background: "var(--background)" }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-slate-900">
          Incheck
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/upload"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            App
          </Link>
        </div>
      </div>
    </footer>
  );
}
