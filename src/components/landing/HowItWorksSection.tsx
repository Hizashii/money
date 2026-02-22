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
      style={{
        // Card 3: sticks 64px (2 × CARD_PEEK) from top, highest z-index
        position: "sticky",
        top: 64,
        zIndex: 3,
        minHeight: "auto",
        marginBottom: 100,
        background: "#fafafa",
        borderRadius: "24px 24px 0 0",
        boxShadow: "0 -6px 40px rgba(0,0,0,0.13)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Handle */}
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
            Process
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
            How it works
          </h2>

          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: "clamp(15px, 1.8vw, 18px)",
            color: "#64748b",
            lineHeight: 1.7,
            maxWidth: 440,
            margin: "0 auto",
          }}>
            Three steps from PDF to spreadsheet.
          </p>
        </div>

        {/* ── Steps ── */}
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
          gap: 16,
          alignContent: "start",
        }}>
          {HOW_IT_WORKS_STEPS.map((item, i) => (
            <AnimatedSection key={item.step}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}>
                {/* Step number circle */}
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
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#0f172a",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    flexShrink: 0,
                  }}
                >
                  {item.step}
                </motion.div>

                {/* Visual placeholder */}
                <div style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  borderRadius: 16,
                  border: "0.5px solid rgba(0,0,0,0.08)",
                  background: "white",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  overflow: "hidden",
                }}>
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "#f1f5f9",
                    }}
                  />
                </div>

                <h3 style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: "0 0 8px",
                }}>
                  {item.title}
                </h3>

                <p style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 13,
                  color: "#64748b",
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {item.desc}
                </p>
              </div>
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
        03 / 03
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}
