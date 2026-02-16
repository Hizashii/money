"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const SECTIONS = [
  { id: "product", label: "Product" },
  { id: "invoices", label: "Examples" },
  { id: "how-it-works", label: "How it works" },
  { id: "reviews", label: "Reviews" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 400], [0, 60]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const scrollY = window.scrollY + 120;
      for (const { id } of SECTIONS) {
        const el = sectionRefs.current[id];
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-x-hidden">
      {/* Navbar */}
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
            className="font-semibold text-xl text-slate-900 tracking-tight"
          >
            Incheck
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
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

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-[#fafafa]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(99,102,241,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_80%,rgba(139,92,246,0.06),transparent)]" />

        {/* Floating orbs */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-200/30 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-indigo-200/25 blur-3xl"
        />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20"
        >
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]"
            >
              Invoice extraction
              <br />
              <span className="text-slate-500">without the guesswork</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
            >
              Upload PDF invoices. Extract vendor, amounts, and payment details.
              Check legitimacy. Export to Excel.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/upload">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-slate-900/20"
                >
                  Get started
                </motion.span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollTo("how-it-works")}
                className="rounded-full border-2 border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 transition-colors"
              >
                See how it works
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-slate-300 flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* Product */}
      <section
        id="product"
        ref={(el) => {
          sectionRefs.current["product"] = el;
        }}
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
            {[
              {
                title: "Upload & extract",
                desc: "Drag and drop PDF invoices. We extract vendor, dates, amounts, VAT, and payment details using a 3-layer pipeline.",
                icon: (
                  <svg
                    className="w-12 h-12 text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                ),
                gradient: "from-slate-100 to-slate-50",
              },
              {
                title: "Legitimacy check",
                desc: "We validate math, IBAN checksums, and beneficiary matching. We flag issues so you can fix them before paying.",
                icon: (
                  <svg
                    className="w-12 h-12 text-rose-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                ),
                gradient: "from-rose-50 to-white",
              },
              {
                title: "Export to Excel",
                desc: "Download structured data with all extracted fields. No AI, no API keys—runs locally in your browser.",
                icon: (
                  <svg
                    className="w-12 h-12 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ),
                gradient: "from-emerald-50 to-white",
              },
            ].map((item, i) => (
              <AnimatedSection key={i}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div
                    className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 border border-slate-100`}
                  >
                    {item.icon}
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

      {/* Invoices we extract */}
      <section
        id="invoices"
        ref={(el) => {
          sectionRefs.current["invoices"] = el;
        }}
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
            {[
              {
                title: "Professional invoices",
                desc: "Line items, totals, payment terms",
                icon: "📄",
              },
              {
                title: "Full payment details",
                desc: "IBAN, SWIFT, beneficiary info",
                icon: "🏦",
              },
              {
                title: "Service & hourly",
                desc: "Hours, rates, subtotals",
                icon: "⏱️",
              },
            ].map((item, i) => (
              <AnimatedSection key={i}>
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

      {/* How it works */}
      <section
        id="how-it-works"
        ref={(el) => {
          sectionRefs.current["how-it-works"] = el;
        }}
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
            {[
              {
                step: "1",
                title: "Upload PDFs",
                desc: "Drag and drop or select invoice PDFs. We extract text and normalize it for reliable parsing.",
              },
              {
                step: "2",
                title: "Review & fix",
                desc: "Check extracted data, legitimacy scores, and fix any wrong fields before export.",
              },
              {
                step: "3",
                title: "Export",
                desc: "Download Excel or CSV with all fields. Use it in your accounting workflow.",
              },
            ].map((item, i) => (
              <AnimatedSection key={i}>
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
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
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

      {/* Reviews */}
      <section
        id="reviews"
        ref={(el) => {
          sectionRefs.current["reviews"] = el;
        }}
        className="py-24 sm:py-32 px-4 sm:px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
              What people say
            </h2>
          </AnimatedSection>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Finally, a simple way to get invoice data into a spreadsheet without manual typing.",
                author: "Finance team lead",
                role: "SMB",
              },
              {
                quote:
                  "The legitimacy check caught a mismatch we would have missed. Saved us from a potential fraud.",
                author: "Operations manager",
                role: "Startup",
              },
              {
                quote:
                  "Clean export to Excel. No AI, no subscriptions—just works.",
                author: "Freelancer",
                role: "Solo",
              },
            ].map((r, i) => (
              <AnimatedSection key={i}>
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

      {/* CTA */}
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

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-semibold text-slate-900">
            Incheck
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/upload"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
