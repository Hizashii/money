"use client";

import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/70 bg-[var(--background)]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6">
        <div className="flex flex-col items-center gap-3 text-center">
          {/* Brand */}
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-slate-900 hover:opacity-80 transition"
          >
            Incheck
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
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
          </nav>

          {/* Small meta */}
          <p className="text-xs text-slate-500">
            © {year} Incheck. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}