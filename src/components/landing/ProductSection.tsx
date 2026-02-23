"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProductSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

// ─── Feature data (replace with your PRODUCT_FEATURES import if preferred) ───
const FEATURES = [
  {
    num: "01",
    title: "PDF extraction",
    desc: "Drop any invoice PDF — scanned or digital. The parser identifies vendor, date, line items, totals, and tax fields automatically, without templates.",
    tag: "Parsing",
    color: "#dbeafe",
    accent: "#1d4ed8",
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Document */}
        <rect x="40" y="14" width="88" height="112" rx="7" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
        <rect x="54" y="32" width="42" height="5" rx="2.5" fill="#bfdbfe"/>
        <rect x="54" y="45" width="60" height="4" rx="2" fill="#e2e8f0"/>
        <rect x="54" y="54" width="52" height="4" rx="2" fill="#e2e8f0"/>
        <rect x="54" y="63" width="56" height="4" rx="2" fill="#e2e8f0"/>
        <rect x="54" y="76" width="60" height="1.5" rx="1" fill="#f1f5f9"/>
        <rect x="54" y="84" width="38" height="4" rx="2" fill="#e2e8f0"/>
        <rect x="54" y="93" width="44" height="4" rx="2" fill="#e2e8f0"/>
        <rect x="54" y="102" width="32" height="4" rx="2" fill="#dbeafe"/>
        {/* Extraction arrows */}
        <path d="M134 70 L152 70" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3"/>
        <path d="M148 66 L154 70 L148 74" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Output chips */}
        <rect x="158" y="28" width="50" height="18" rx="9" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1"/>
        <text x="183" y="40" fontFamily="system-ui" fontSize="8" fill="#1d4ed8" textAnchor="middle" fontWeight="600">Vendor</text>
        <rect x="158" y="52" width="50" height="18" rx="9" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1"/>
        <text x="183" y="64" fontFamily="system-ui" fontSize="8" fill="#1d4ed8" textAnchor="middle" fontWeight="600">Date</text>
        <rect x="158" y="76" width="50" height="18" rx="9" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1"/>
        <text x="183" y="88" fontFamily="system-ui" fontSize="8" fill="#1d4ed8" textAnchor="middle" fontWeight="600">Total</text>
        <rect x="158" y="100" width="50" height="18" rx="9" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1"/>
        <text x="183" y="112" fontFamily="system-ui" fontSize="8" fill="#1d4ed8" textAnchor="middle" fontWeight="600">Tax</text>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Legitimacy checks",
    desc: "Every invoice is validated against IBAN checksums, VAT number formats, math totals, and beneficiary matching — flagging issues before they cost you.",
    tag: "Validation",
    color: "#dcfce7",
    accent: "#16a34a",
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield */}
        <path d="M110 18 L148 34 L148 72 C148 96 110 120 110 120 C110 120 72 96 72 72 L72 34 Z" fill="white" stroke="#bbf7d0" strokeWidth="1.5"/>
        {/* Check rows */}
        <rect x="86" y="48" width="48" height="6" rx="3" fill="#dcfce7"/>
        <circle cx="82" cy="51" r="5" fill="#16a34a"/>
        <path d="M79.5 51 L81.5 53 L84.5 49" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="86" y="62" width="48" height="6" rx="3" fill="#dcfce7"/>
        <circle cx="82" cy="65" r="5" fill="#16a34a"/>
        <path d="M79.5 65 L81.5 67 L84.5 63" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="86" y="76" width="36" height="6" rx="3" fill="#fef9c3"/>
        <circle cx="82" cy="79" r="5" fill="#eab308"/>
        <text x="82" y="82.5" fontFamily="system-ui" fontSize="7" fill="white" textAnchor="middle" fontWeight="700">!</text>
        <rect x="86" y="90" width="48" height="6" rx="3" fill="#dcfce7"/>
        <circle cx="82" cy="93" r="5" fill="#16a34a"/>
        <path d="M79.5 93 L81.5 95 L84.5 91" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Score arc */}
        <circle cx="165" cy="54" r="24" fill="none" stroke="#f0fdf4" strokeWidth="6"/>
        <circle cx="165" cy="54" r="24" fill="none" stroke="#16a34a" strokeWidth="6"
          strokeDasharray={`${2*Math.PI*24*0.87} ${2*Math.PI*24*(1-0.87)}`}
          strokeLinecap="round" transform="rotate(-90 165 54)"/>
        <text x="165" y="51" fontFamily="system-ui" fontSize="11" fill="#0f172a" textAnchor="middle" fontWeight="700">87%</text>
        <text x="165" y="62" fontFamily="system-ui" fontSize="7" fill="#64748b" textAnchor="middle">trust</text>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Smart export",
    desc: "One click sends your validated invoice data to a clean Excel or CSV file - with columns mapped exactly how your finance team expects them.",
    tag: "Export",
    color: "#fce7f3",
    accent: "#db2777",
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Spreadsheet */}
        <rect x="30" y="24" width="120" height="92" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
        {/* Header row */}
        <rect x="30" y="24" width="120" height="18" rx="8" fill="#f8fafc"/>
        <rect x="30" y="36" width="120" height="6" rx="0" fill="#f8fafc"/>
        {/* Column headers */}
        <rect x="38" y="29" width="24" height="8" rx="2" fill="#e2e8f0"/>
        <rect x="68" y="29" width="20" height="8" rx="2" fill="#e2e8f0"/>
        <rect x="94" y="29" width="24" height="8" rx="2" fill="#e2e8f0"/>
        <rect x="124" y="29" width="18" height="8" rx="2" fill="#e2e8f0"/>
        {/* Rows */}
        {[0,1,2,3].map((r) => (
          <g key={r}>
            <rect x="38" y={50 + r*18} width="24" height="7" rx="2" fill="#f1f5f9"/>
            <rect x="68" y={50 + r*18} width="20" height="7" rx="2" fill="#f1f5f9"/>
            <rect x="94" y={50 + r*18} width="24" height="7" rx="2" fill="#f1f5f9"/>
            <rect x="124" y={50 + r*18} width="18" height="7" rx="2" fill={r===1?"#fce7f3":"#f1f5f9"}/>
          </g>
        ))}
        {/* Arrow + download */}
        <path d="M158 70 L176 70" stroke="#db2777" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3"/>
        <path d="M172 66 L178 70 L172 74" stroke="#db2777" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        {/* File badge */}
        <rect x="180" y="52" width="32" height="36" rx="6" fill="#fff0f6" stroke="#fbcfe8" strokeWidth="1"/>
        <path d="M188 70 L196 70 M192 66 L192 74" stroke="#db2777" strokeWidth="1.6" strokeLinecap="round"/>
        <rect x="183" y="78" width="26" height="6" rx="3" fill="#fbcfe8"/>
        <text x="196" y="83.5" fontFamily="system-ui" fontSize="6.5" fill="#db2777" textAnchor="middle" fontWeight="700">XLSX</text>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Batch processing",
    desc: "Upload dozens of invoices at once. The pipeline runs in parallel, so a hundred PDFs process in the same time as one.",
    tag: "Speed",
    color: "#ede9fe",
    accent: "#7c3aed",
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Stack of docs */}
        <rect x="46" y="38" width="72" height="90" rx="7" fill="#f5f3ff" stroke="#ddd6fe" strokeWidth="1.2"/>
        <rect x="52" y="30" width="72" height="90" rx="7" fill="#ede9fe" stroke="#ddd6fe" strokeWidth="1.2"/>
        <rect x="58" y="22" width="72" height="90" rx="7" fill="white" stroke="#ddd6fe" strokeWidth="1.5"/>
        {/* Lines on top doc */}
        <rect x="70" y="40" width="46" height="5" rx="2" fill="#ede9fe"/>
        <rect x="70" y="52" width="38" height="4" rx="2" fill="#f1f5f9"/>
        <rect x="70" y="61" width="42" height="4" rx="2" fill="#f1f5f9"/>
        <rect x="70" y="70" width="34" height="4" rx="2" fill="#f1f5f9"/>
        {/* Progress bar */}
        <rect x="70" y="84" width="46" height="6" rx="3" fill="#f1f5f9"/>
        <rect x="70" y="84" width="32" height="6" rx="3" fill="#7c3aed"/>
        {/* Count badge */}
        <circle cx="170" cy="50" r="22" fill="#ede9fe"/>
        <text x="170" y="47" fontFamily="system-ui" fontSize="16" fill="#7c3aed" textAnchor="middle" fontWeight="700">48</text>
        <text x="170" y="60" fontFamily="system-ui" fontSize="7.5" fill="#6d28d9" textAnchor="middle">files</text>
        {/* Speed lines */}
        <path d="M148 86 L155 86" stroke="#7c3aed" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M148 90 L158 90" stroke="#7c3aed" strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
        <path d="M148 94 L153 94" stroke="#7c3aed" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
  {
    num: "05",
    title: "Duplicate detection",
    desc: "Automatic cross-referencing catches re-submitted invoices before they get paid twice - matching on invoice number, vendor, date, and amount simultaneously.",
    tag: "Accuracy",
    color: "#fef3c7",
    accent: "#d97706",
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Two overlapping docs */}
        <rect x="30" y="30" width="72" height="90" rx="7" fill="white" stroke="#fde68a" strokeWidth="1.5"/>
        <rect x="60" y="22" width="72" height="90" rx="7" fill="white" stroke="#fde68a" strokeWidth="1.5"/>
        {/* Match line */}
        <path d="M66 70 L90 70" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 3"/>
        {/* Warning badge */}
        <circle cx="132" cy="52" r="18" fill="#fef3c7" stroke="#fde68a" strokeWidth="1.5"/>
        <path d="M132 44 L132 55" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="132" cy="59" r="1.5" fill="#d97706"/>
        {/* Lines on left doc */}
        <rect x="40" y="48" width="42" height="5" rx="2" fill="#fef9c3"/>
        <rect x="40" y="60" width="34" height="4" rx="2" fill="#f1f5f9"/>
        <rect x="40" y="69" width="38" height="4" rx="2" fill="#f1f5f9"/>
        {/* Lines on right doc */}
        <rect x="70" y="40" width="42" height="5" rx="2" fill="#fef9c3"/>
        <rect x="70" y="52" width="34" height="4" rx="2" fill="#f1f5f9"/>
        <rect x="70" y="61" width="38" height="4" rx="2" fill="#f1f5f9"/>
        {/* Duplicate label */}
        <rect x="152" y="82" width="52" height="18" rx="9" fill="#fef3c7" stroke="#fde68a" strokeWidth="1"/>
        <text x="178" y="94" fontFamily="system-ui" fontSize="8" fill="#d97706" textAnchor="middle" fontWeight="700">DUPLICATE</text>
      </svg>
    ),
  },
  {
    num: "06",
    title: "Audit trail",
    desc: "Every extraction and validation decision is logged with a timestamp — giving you a clean, shareable record for audits, disputes, or compliance reviews.",
    tag: "Compliance",
    color: "#e0f2fe",
    accent: "#0284c7",
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Timeline */}
        <line x1="80" y1="20" x2="80" y2="120" stroke="#e0f2fe" strokeWidth="2"/>
        {/* Events */}
        {[
          { y: 30, label: "Uploaded",   color: "#0284c7", w: 52 },
          { y: 55, label: "Parsed",     color: "#0284c7", w: 44 },
          { y: 80, label: "Validated",  color: "#16a34a", w: 56 },
          { y: 105, label: "Exported",  color: "#7c3aed", w: 52 },
        ].map(({ y, label, color, w }) => (
          <g key={label}>
            <circle cx="80" cy={y} r="5" fill={color}/>
            <rect x="92" y={y - 9} width={w} height="18" rx="6" fill="white" stroke="#e0f2fe" strokeWidth="1"/>
            <text x={92 + w/2} y={y + 4} fontFamily="system-ui" fontSize="8" fill={color} textAnchor="middle" fontWeight="600">{label}</text>
            {/* Timestamp */}
            <text x="72" y={y + 4} fontFamily="system-ui" fontSize="7" fill="#64748b" textAnchor="end">09:4{Math.floor(y/10)}</text>
          </g>
        ))}
      </svg>
    ),
  },
];

export function ProductSection({ sectionRef }: ProductSectionProps) {
  const innerRef    = useRef<HTMLElement | null>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const rowRefs     = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fade-up
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 88%", once: true } }
      );

      // Feature rows stagger in
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const fromLeft = i % 2 === 0;
        gsap.fromTo(row,
          { opacity: 0, x: fromLeft ? -32 : 32, y: 16 },
          { opacity: 1, x: 0, y: 0, duration: 0.75, ease: "power3.out",
            delay: (i % 2) * 0.08,
            scrollTrigger: { trigger: row, start: "top 88%", once: true } }
        );
      });
    }, innerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="product"
      ref={(el) => {
        innerRef.current = el;
        sectionRef(el);
      }}
      style={{
        background: "transparent",
        paddingBottom: 120,
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* ── Header ── */}
      <div ref={headerRef} style={{
        textAlign: "center",
        paddingTop: "clamp(64px, 8vw, 112px)",
        paddingLeft: "clamp(16px, 4vw, 40px)",
        paddingRight: "clamp(16px, 4vw, 40px)",
        paddingBottom: "clamp(48px, 6vw, 80px)",
        position: "relative",
      }}>
        {/* Eyebrow */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#eff6ff", border: "1px solid #bfdbfe",
          borderRadius: 999, padding: "6px 14px",
          marginBottom: 28,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "#1d4ed8",
            boxShadow: "0 0 0 3px rgba(29,78,216,0.18)",
            display: "inline-block",
          }}/>
          <span style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase" as const, color: "#1d4ed8",
          }}>Features</span>
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
          fontWeight: 700, lineHeight: 1.06,
          letterSpacing: "-0.025em", color: "#0a0a14",
          margin: "0 0 20px",
        }}>
          Everything you need,<br />
          <span style={{ color: "#1d4ed8" }}>nothing you don't.</span>
        </h2>

        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: "clamp(15px, 1.8vw, 18px)",
          color: "#475569", lineHeight: 1.75,
          maxWidth: 480, margin: "0 auto",
        }}>
          A focused toolkit for invoice processing — no bloat, no lock-in,
          no per-seat pricing.
        </p>
      </div>

      {/* ── Feature grid: 2-col asymmetric ── */}
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 clamp(16px, 4vw, 48px)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 16,
      }}>
        {FEATURES.map((f, i) => (
          <FeatureCard
            key={f.num}
            feature={f}
            ref={(el) => { rowRefs.current[i] = el; }}
          />
        ))}
      </div>

      {/* ── Bottom stat bar ── */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
import { forwardRef } from "react";

interface FeatureCardProps {
  feature: typeof FEATURES[0];
}

const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(({ feature: f }, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Merge refs
  const setRef = (el: HTMLDivElement | null) => {
    (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  return (
    <div
      ref={setRef}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = `0 12px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = `0 1px 4px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06)`;
      }}
      style={{
        background: "white",
        borderRadius: 20,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease",
        cursor: "default",
      }}
    >
      {/* Illustration panel */}
      <div style={{
        background: f.color,
        height: 160,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {/* Subtle inner glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}/>
        {/* Number watermark */}
        <div style={{
          position: "absolute", bottom: -10, right: 16,
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 80, fontWeight: 700, lineHeight: 1,
          color: "rgba(0,0,0,0.05)",
          userSelect: "none",
          pointerEvents: "none",
        }}>{f.num}</div>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {f.illustration}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "22px 26px 26px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Tag */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: `${f.color}cc`, borderRadius: 999,
          padding: "3px 10px", alignSelf: "flex-start",
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: f.accent, display: "inline-block",
          }}/>
          <span style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase" as const, color: f.accent,
          }}>{f.tag}</span>
        </div>

        <h3 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 20, fontWeight: 700, lineHeight: 1.2,
          color: "#0f172a", margin: 0,
        }}>{f.title}</h3>

        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 13.5, color: "#475569", lineHeight: 1.75, margin: 0,
        }}>{f.desc}</p>
      </div>
    </div>
  );
});
FeatureCard.displayName = "FeatureCard";

// ─── Stat bar ─────────────────────────────────────────────────────────────────
function StatBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true } }
      );
    });
    return () => ctx.revert();
  }, []);

}
