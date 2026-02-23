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
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-2xl mx-auto sm:px-22 grid grid-cols-3 items-center h-16">
        <div className="hidden md:flex items-center gap-6">
          {SECTIONS.slice(0, 2).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onNavClick(id)}
              className={`text-sm font-medium transition-colors duration-200 ${
                activeSection === id
                  ? "text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <Link
          href="/"
          className="font-bold text-xl text-slate-900 tracking-tight justify-self-center col-start-2"
        >
          Incheck
        </Link>
        <div className="hidden md:flex items-center gap-6 justify-end col-start-3">
          {SECTIONS.slice(2).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onNavClick(id)}
              className={`text-sm font-medium transition-colors duration-200 ${
                activeSection === id
                  ? "text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
