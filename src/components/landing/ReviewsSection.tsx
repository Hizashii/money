"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { REVIEWS } from "./constants";

interface ReviewsSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export function ReviewsSection({ sectionRef }: ReviewsSectionProps) {
  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-6 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
            What people say
          </h2>
        </AnimatedSection>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <AnimatedSection key={`${r.author}-${r.role}`}>
              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/30 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-slate-700 italic leading-relaxed">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm font-medium text-slate-900">
                  {r.author}
                </p>
                <p className="text-xs text-slate-500">{r.role}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
