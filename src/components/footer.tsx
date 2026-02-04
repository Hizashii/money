import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full shrink-0 border-t border-slate-200/60 bg-white mt-auto">
      <div className="py-4 px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-slate-500">
        <span>© {new Date().getFullYear()} Money. Invoice PDF extraction tool.</span>
        <span className="hidden sm:inline">·</span>
        <Link href="/privacy" className="hover:text-slate-700 transition">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-slate-700 transition">
          Terms
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
