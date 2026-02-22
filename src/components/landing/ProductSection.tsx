"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedSection } from "./AnimatedSection";
import { ProductIcon } from "./icons";
import { PRODUCT_FEATURES } from "./constants";

gsap.registerPlugin(ScrollTrigger);

interface ProductSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

// How many px of the card peek above the next card's top edge
export const CARD_PEEK = 32;

export function ProductSection({ sectionRef }: ProductSectionProps) {
  const sectionInnerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.fromTo(
      sectionInnerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionInnerRef.current,
          start: "top 90%",
          once: true,
        },
      }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      id="product"
      ref={(el) => {
        sectionInnerRef.current = el;
        sectionRef(el);
      }}
      style={{
        // Sticky: card 1 sits at top:0, cards 2 and 3 will cover it
        position: "sticky",
        top: 0,
        zIndex: 1,
        background: "#f7f7f9",
        borderTop: "1px solid rgba(0,0,0,0.05)",
        minHeight: "auto",
        marginBottom: 100,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ── */}
      <div style={{
        textAlign: "center",
        paddingTop: "clamp(32px, 5vw, 56px)",
        paddingLeft: "clamp(16px, 4vw, 40px)",
        paddingRight: "clamp(16px, 4vw, 40px)",
        marginBottom: "clamp(16px, 2vw, 32px)",
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
          Features
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
          What is Incheck?
        </h2>

        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: "clamp(15px, 1.8vw, 18px)",
          color: "#64748b",
          lineHeight: 1.7,
          maxWidth: 520,
          margin: "0 auto",
        }}>
          A lightweight tool that reads your invoice PDFs, extracts key
          fields, checks for issues, and lets you export everything to Excel
          or CSV.
        </p>
      </div>

      {/* ── Feature grid ── */}
      <div style={{
        flex: 1,
        maxWidth: 1120,
        margin: "0 auto",
        width: "100%",
        paddingLeft: "clamp(16px, 4vw, 40px)",
        paddingRight: "clamp(16px, 4vw, 40px)",
        paddingBottom: "clamp(20px, 3vw, 40px)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 12,
        alignContent: "start",
      }}>
        {PRODUCT_FEATURES.map((item, i) => (
          <AnimatedSection key={item.title}>
            <div style={{
              background: "white",
              borderRadius: 18,
              border: "0.5px solid rgba(0,0,0,0.07)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              padding: "clamp(22px, 2.5vw, 32px)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${item.gradient ?? "#dbeafe, #eff6ff"})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(0,0,0,0.06)",
              }}>
                <ProductIcon iconKey={item.iconKey} />
              </div>
              <div>
                <h3 style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: "0 0 6px",
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
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* ── Card number bottom-left ── */}
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
        01 / 03
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}
