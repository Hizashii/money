"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { HOW_IT_WORKS_STEPS } from "./constants";

interface HowItWorksSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export function HowItWorksSection({ sectionRef }: HowItWorksSectionProps) {
  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-6 bg-[#fafafa]"
    >
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
            How it works
          </h2>
          <p className="mt-4 text-lg text-slate-500 text-center max-w-2xl mx-auto">
            Three steps from PDF to spreadsheet.
          </p>
        </AnimatedSection>
        <div className="mt-20 grid sm:grid-cols-3 gap-8 lg:gap-12">
          {HOW_IT_WORKS_STEPS.map((item, i) => (
            <AnimatedSection key={item.step}>
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: i * 0.1,
                  }}
                  className="inline-flex w-12 h-12 rounded-full bg-slate-900 text-white text-sm font-bold items-center justify-center mb-6 shrink-0"
                >
                  {item.step}
                </motion.div>
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-16 h-16 rounded-full bg-slate-100"
                  />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
