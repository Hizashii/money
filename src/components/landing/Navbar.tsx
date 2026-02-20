"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SECTIONS } from "./constants";

interface NavbarProps {
  scrolled: boolean;
  activeSection: string;
  onNavClick: (id: string) => void;
}

export function Navbar({ scrolled, activeSection, onNavClick }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-bold text-xl text-slate-900 tracking-tight"
        >
          Incheck
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onNavClick(id)}
              className={`text-sm font-medium transition-colors duration-200 ${
                activeSection === id
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <Link
          href="/upload"
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Try Incheck
        </Link>
      </div>
    </motion.nav>
  );
}
