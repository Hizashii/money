"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HowItWorksSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

const STEPS = [
  { num: "01", title: "Upload",           body: "Drop your PDFs — scanned, digital, one or a hundred. No account, no templates, no configuration." },
  { num: "02", title: "Extract & check",  body: "Fields are pulled and cross-checked in under 2 seconds. IBAN, VAT, totals, duplicates — all verified automatically." },
  { num: "03", title: "Export",           body: "One click to Excel or CSV. Columns mapped exactly as your finance team needs them." },
];

const BEFORE = ["Manual copy-paste", "Missed duplicates", "Formula errors", "Hours per batch", "No audit trail"];
const AFTER  = ["Auto-extracted",    "Duplicates flagged", "Math verified",  "< 2s per invoice", "Full log kept" ];

export function HowItWorksSection({ sectionRef }: HowItWorksSectionProps) {
  const innerRef  = useRef<HTMLElement | null>(null);
  const leftRef   = useRef<HTMLDivElement>(null);
  const rightRef  = useRef<HTMLDivElement>(null);
  const stepsRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -32 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: innerRef.current, start: "top 78%", once: true } }
      );
      gsap.fromTo(rightRef.current,
        { opacity: 0, x: 32 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: innerRef.current, start: "top 78%", once: true } }
      );
      gsap.fromTo(".hiw-step",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.12,
          scrollTrigger: { trigger: stepsRef.current, start: "top 84%", once: true } }
      );
    }, innerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={(el) => { innerRef.current = el; sectionRef(el); }}
      style={{
        position: "sticky",
        top: 64,
        zIndex: 3,
        marginBottom: 100,
        background: "#f8fafc",
        borderRadius: "24px 24px 0 0",
        boxShadow: "0 -6px 40px rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Handle */}
      <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.08)", margin: "14px auto 0", flexShrink: 0 }}/>

      {/* ── Top: steps row ── */}
      <div style={{
        padding: "clamp(32px,4vw,60px) clamp(20px,5vw,64px) 0",
      }}>
        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 999, padding: "5px 14px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1d4ed8", display: "inline-block" }}/>
            <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#1d4ed8" }}>How it works</span>
          </div>
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
          fontWeight: 700, lineHeight: 1.06,
          letterSpacing: "-0.025em", color: "#0a0a14",
          margin: "0 0 clamp(32px,4vw,56px)",
          maxWidth: 540,
        }}>
          Three steps from<br/>
          <span style={{ color: "#1d4ed8" }}>PDF to spreadsheet.</span>
        </h2>

        {/* Steps — horizontal, no cards */}
        <div
          ref={stepsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 0,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className="hiw-step"
              style={{
                padding: "clamp(22px, 2.5vw, 32px) clamp(16px, 2vw, 28px) clamp(22px, 2.5vw, 32px) 0",
                borderRight: i < STEPS.length - 1 ? "1px solid #f1f5f9" : "none",
                paddingRight: i < STEPS.length - 1 ? "clamp(16px, 2vw, 28px)" : 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: 11, color: "#94a3b8",
                  letterSpacing: "0.1em", fontWeight: 700,
                }}>{s.num}</span>
                <div style={{ flex: 1, height: 1, background: "#f1f5f9" }}/>
              </div>
              <h3 style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "clamp(17px, 2vw, 21px)",
                fontWeight: 700, color: "#0f172a",
                margin: "0 0 10px", lineHeight: 1.2,
              }}>{s.title}</h3>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 13, color: "#64748b",
                lineHeight: 1.75, margin: 0,
              }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom: before / after ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        margin: "clamp(28px, 4vw, 48px) clamp(20px, 5vw, 64px) clamp(40px, 5vw, 72px)",
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid #f1f5f9",
      }}>
        {/* Before */}
        <div ref={leftRef} style={{ padding: "clamp(20px,2.5vw,32px)", background: "#fafafa", borderRight: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block" }}/>
            <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#ef4444" }}>Before</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {BEFORE.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="6" fill="rgba(239,68,68,0.12)"/>
                  <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13.5, color: "#94a3b8", textDecoration: "line-through", textDecorationColor: "rgba(239,68,68,0.4)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* After */}
        <div ref={rightRef} style={{ padding: "clamp(20px,2.5vw,32px)", background: "#f0fdf4" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", display: "inline-block" }}/>
            <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#34d399" }}>With Incheck</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {AFTER.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="6" fill="rgba(52,211,153,0.15)"/>
                  <path d="M4.5 7l2 2 3.5-3.5" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13.5, color: "#166534", fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer strip ── */}
      <div style={{
        marginTop: "auto",
        borderTop: "1px solid #f1f5f9",
        padding: "clamp(16px,2vw,24px) clamp(20px,5vw,64px)",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <a
          href="/upload"
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, fontWeight: 600,
            color: "white", background: "#1d4ed8",
            borderRadius: 999, padding: "10px 24px",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            boxShadow: "0 2px 12px rgba(29,78,216,0.35)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(29,78,216,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(29,78,216,0.35)"; }}
        >
          Try it free
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8M8 4l2.5 2.5L8 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
    </section>
  );
}
