"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface InvoicesSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

const TYPES = [
  { label: "Service invoices",    sub: "Hours · Rates · Deliverables",   num: "01" },
  { label: "Product / PO",        sub: "SKUs · Quantities · Unit prices", num: "02" },
  { label: "Recurring billing",   sub: "Subscriptions · Retainers",       num: "03" },
  { label: "Credit notes",        sub: "Refunds · Adjustments",           num: "04" },
  { label: "Multi-currency",      sub: "USD · EUR · GBP · Auto-convert",  num: "05" },
  { label: "Scanned PDFs",        sub: "OCR · Rotated · Low-res",         num: "06" },
];

export function InvoicesSection({ sectionRef }: InvoicesSectionProps) {
  const innerRef  = useRef<HTMLElement | null>(null);
  const listRef   = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline
      gsap.fromTo(".inv-headline",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: innerRef.current, start: "top 80%", once: true } }
      );
      // List rows stagger
      gsap.fromTo(".inv-row",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.55, ease: "power2.out",
          stagger: 0.07,
          scrollTrigger: { trigger: listRef.current, start: "top 82%", once: true } }
      );
    }, innerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="invoices"
      ref={(el) => { innerRef.current = el; sectionRef(el); }}
      style={{
        position: "sticky",
        top: 32,
        zIndex: 2,
        marginBottom: 100,
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* Handle */}
      <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.12)", margin: "14px auto 0" }}/>

      <div style={{
        maxWidth: 1120,
        margin: "0 auto",
        padding: "clamp(36px,5vw,72px) clamp(20px,5vw,64px) clamp(48px,6vw,96px)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(32px, 4vw, 72px)",
        alignItems: "start",
      }}>

        {/* ── Left col: headline + blurb ── */}
        <div className="inv-headline" style={{ paddingTop: "clamp(0px, 1vw, 16px)" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 999, padding: "5px 14px", marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1d4ed8", display: "inline-block" }}/>
            <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#1d4ed8" }}>Invoice types</span>
          </div>

          <h2 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
            fontWeight: 700, lineHeight: 1.06,
            letterSpacing: "-0.025em", color: "#0a0a14",
            margin: "0 0 24px",
          }}>
            Every format<br/>we handle.
          </h2>

          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: "#475569", lineHeight: 1.8,
            maxWidth: 340, margin: "0 0 40px",
          }}>
            Digital or scanned, simple or complex — Incheck reads the invoice, not just the format.
          </p>

          {/* Static field tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Vendor","Date","Total","VAT","IBAN","Line items","Currency","Due date"].map(f => (
              <span key={f} style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 11, fontWeight: 500,
                color: "#475569", background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 999, padding: "4px 12px",
              }}>{f}</span>
            ))}
          </div>
        </div>

        {/* ── Right col: typographic list ── */}
        <div ref={listRef} style={{ borderTop: "1px solid #e2e8f0" }}>
          {TYPES.map((t, i) => (
            <div
              key={t.num}
              className="inv-row"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "clamp(14px, 1.8vw, 22px) 0",
                borderBottom: "1px solid #e2e8f0",
                cursor: "default",
                transition: "padding-left 0.2s ease",
                paddingLeft: hovered === i ? 12 : 0,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "clamp(17px, 2vw, 22px)",
                  fontWeight: 700,
                  color: hovered === i ? "#1d4ed8" : "#0f172a",
                  transition: "color 0.18s ease",
                  lineHeight: 1.2,
                }}>{t.label}</span>
                <span style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 12, color: "#64748b",
                  opacity: hovered === i ? 1 : 0.95,
                  transition: "opacity 0.18s ease",
                }}>{t.sub}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <span style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: 11, color: "#64748b",
                  letterSpacing: "0.06em", fontWeight: 700,
                }}>{t.num}</span>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  border: `1.5px solid ${hovered === i ? "#1d4ed8" : "#94a3b8"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 0.18s ease, background 0.18s ease",
                  background: hovered === i ? "#1d4ed8" : "transparent",
                }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2.5 5.5h6M6 3l2.5 2.5L6 8" stroke={hovered === i ? "white" : "#64748b"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 02 / 03 */}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </section>
  );
}
