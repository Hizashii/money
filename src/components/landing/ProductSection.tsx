"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { ProductIcon } from "./icons";
import { PRODUCT_FEATURES } from "./constants";

interface ProductSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export function ProductSection({ sectionRef }: ProductSectionProps) {
  return (
    <section
      id="product"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
            What is Incheck?
          </h2>
          <p className="mt-4 text-lg text-slate-500 text-center max-w-2xl mx-auto">
            A lightweight tool that reads your invoice PDFs, extracts key
            fields, checks for issues, and lets you export everything to Excel
            or CSV.
          </p>
        </AnimatedSection>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_FEATURES.map((item, i) => (
            <AnimatedSection key={item.title}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 border border-slate-100`}
                >
                  <ProductIcon iconKey={item.iconKey} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
