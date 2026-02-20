"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_120%,rgba(99,102,241,0.15),transparent)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Ready to extract?
        </h2>
        <p className="mt-4 text-slate-300">
          Upload your first invoice and see the magic.
        </p>
        <Link href="/upload">
          <motion.span
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block mt-8 rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Try Incheck free
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );
}
