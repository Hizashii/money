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
      style={{
        // Card 2: sticks at CARD_PEEK below card 1's top, z-index above it
        position: "sticky",
        top: 32,
        zIndex: 2,
        minHeight: "auto",
        marginBottom: 100,
        background: "white",
        borderRadius: "24px 24px 0 0",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.10)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Subtle top handle — gives the card-on-card feel */}
      <div style={{
        width: 40,
        height: 4,
        borderRadius: 99,
        background: "rgba(0,0,0,0.1)",
        margin: "12px auto 0",
        flexShrink: 0,
      }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* ── Header ── */}
        <div style={{
          textAlign: "center",
          paddingTop: "clamp(20px, 3vw, 40px)",
          paddingLeft: "clamp(16px, 4vw, 40px)",
          paddingRight: "clamp(16px, 4vw, 40px)",
          marginBottom: "clamp(14px, 2vw, 28px)",
        }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.13em",
            textTransform: "uppercase" as const,
            color: "#1d4ed8",
            marginBottom: 18,
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1v8M1 5h8" stroke="#1d4ed8" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            Invoice types
          </span>

          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#0a0a14",
            margin: "0 0 18px",
          }}>
            Invoices we handle
          </h2>

          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: "clamp(15px, 1.8vw, 18px)",
            color: "#64748b",
            lineHeight: 1.7,
            maxWidth: 520,
            margin: "0 auto",
          }}>
            From simple service invoices to detailed line-item
            documents—Incheck extracts the key data.
          </p>
        </div>

        {/* ── Invoice type grid ── */}
        <div style={{
          flex: 1,
          maxWidth: 1120,
          margin: "0 auto",
          width: "100%",
          paddingLeft: "clamp(16px, 4vw, 40px)",
          paddingRight: "clamp(16px, 4vw, 40px)",
          paddingBottom: "clamp(20px, 3vw, 40px)",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          alignContent: "start",
        }}>
          {INVOICE_TYPES.map((item) => (
            <AnimatedSection key={item.title}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  borderRadius: 18,
                  border: "0.5px solid rgba(0,0,0,0.08)",
                  background: "#f8fafc",
                  overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  cursor: "default",
                }}
              >
                {/* Image area */}
                <div style={{
                  aspectRatio: "4/3",
                  background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <motion.span
                    style={{ fontSize: 48, display: "block" }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {item.icon}
                  </motion.span>
                </div>

                {/* Text */}
                <div style={{ padding: "16px 20px 20px" }}>
                  <p style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: "0 0 4px",
                  }}>
                    {item.title}
                  </p>
                  <p style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 12,
                    color: "#94a3b8",
                    margin: 0,
                    lineHeight: 1.6,
                  }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* ── Card number ── */}
      <div style={{
        position: "absolute",
        bottom: 28,
        left: "clamp(24px, 4vw, 48px)",
        fontFamily: "'DM Serif Display', Georgia, serif",
        fontSize: 13,
        fontWeight: 700,
        color: "#cbd5e1",
        letterSpacing: "0.04em",
        userSelect: "none" as const,
      }}>
        02 / 03
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}
