"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { INVOICE_TYPES } from "./constants";

interface InvoicesSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export function InvoicesSection({ sectionRef }: InvoicesSectionProps) {
  return (
    <section
      id="invoices"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-6 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
            Invoices we handle
          </h2>
          <p className="mt-4 text-lg text-slate-500 text-center max-w-2xl mx-auto">
            From simple service invoices to detailed line-item
            documents—Incheck extracts the key data.
          </p>
        </AnimatedSection>
        <div className="mt-16 grid sm:grid-cols-3 gap-8">
          {INVOICE_TYPES.map((item) => (
            <AnimatedSection key={item.title}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                  <motion.span
                    className="text-5xl"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {item.icon}
                  </motion.span>
                </div>
                <div className="p-5">
                  <p className="text-sm font-medium text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
