"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HowItWorksSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

const STEPS = [
  {
    num: "01",
    title: "Upload",
    body: "Drop your PDFs — scanned, digital, one or a hundred. No account, no templates, no configuration.",
  },
  {
    num: "02",
    title: "Extract & check",
    body: "Fields are pulled and cross-checked in under 2 seconds. IBAN, VAT, totals, duplicates — all verified automatically.",
  },
  {
    num: "03",
    title: "Export",
    body: "One click to Excel or CSV. Columns mapped exactly as your finance team needs them.",
  },
];

const BEFORE = [
  "Manual copy-paste",
  "Missed duplicates",
  "Formula errors",
  "Hours per batch",
  "No audit trail",
];
const AFTER = [
  "Auto-extracted",
  "Duplicates flagged",
  "Math verified",
  "< 2s per invoice",
  "Full log kept",
];

export function HowItWorksSection({ sectionRef }: HowItWorksSectionProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 80%", once: true },
        }
      );

      gsap.fromTo(
        rightRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 80%", once: true },
        }
      );

      gsap.fromTo(
        ".hiw-step",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: { trigger: stepsRef.current, start: "top 86%", once: true },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={(el) => {
        rootRef.current = el;
        sectionRef(el);
      }}
      className="hiw"
    >
      <div className="hiw-handle" />

      <div className="hiw-container">
        {/* Header */}
        <div className="hiw-header">
          <div className="hiw-pill">
            <span className="hiw-dot" />
            <span className="hiw-pillText">How it works</span>
          </div>

          <h2 className="hiw-title">
            Three steps from{" "}
            <span className="hiw-accent">PDF to spreadsheet.</span>
          </h2>

          <p className="hiw-subtitle">
            Upload invoices, let Incheck extract and verify the fields, then export exactly how
            finance wants it.
          </p>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="hiw-steps">
          {STEPS.map((s) => (
            <div key={s.num} className="hiw-step hiw-card">
              <div className="hiw-stepTop">
                <span className="hiw-stepNum">{s.num}</span>
                <span className="hiw-stepLine" />
              </div>

              <h3 className="hiw-stepTitle">{s.title}</h3>
              <p className="hiw-stepBody">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Before / After */}
        <div className="hiw-compare hiw-card">
          <div ref={leftRef} className="hiw-col hiw-before">
            <div className="hiw-colHeader">
              <span className="hiw-badge hiw-badgeRed">Before</span>
            </div>

            <ul className="hiw-list">
              {BEFORE.map((item) => (
                <li key={item} className="hiw-item hiw-itemBefore">
                  <span className="hiw-icon hiw-x" aria-hidden />
                  <span className="hiw-itemText hiw-strike">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div ref={rightRef} className="hiw-col hiw-after">
            <div className="hiw-colHeader">
              <span className="hiw-badge hiw-badgeGreen">With Incheck</span>
            </div>

            <ul className="hiw-list">
              {AFTER.map((item) => (
                <li key={item} className="hiw-item">
                  <span className="hiw-icon hiw-check" aria-hidden />
                  <span className="hiw-itemText">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="hiw-ctaRow">
          <a href="/upload" className="hiw-cta">
            Try it free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M3 7h8M8.5 4.5 11 7l-2.5 2.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <span className="hiw-ctaHint">No account needed · Export to Excel/CSV</span>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <style jsx>{`
        .hiw {
          position: sticky;
          top: 64px;
          z-index: 3;
          background: transparent;
          overflow: hidden;
          padding: 10px 0 18px;
        }

        .hiw-handle {
          width: 40px;
          height: 4px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.12);
          margin: 10px auto 18px;
        }

        .hiw-container {
          width: min(980px, calc(100% - 40px));
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .hiw-header {
          text-align: center;
          display: grid;
          justify-items: center;
          gap: 12px;
          padding: 10px 0 2px;
        }

        .hiw-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 999px;
          padding: 6px 14px;
        }

        .hiw-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #1d4ed8;
          display: inline-block;
        }

        .hiw-pillText {
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1d4ed8;
        }

        .hiw-title {
          font-family: "DM Serif Display", Georgia, serif;
          font-size: clamp(2rem, 3.3vw, 3rem);
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: #0a0a14;
          margin: 0;
          max-width: 720px;
        }

        .hiw-accent {
          color: #1d4ed8;
          white-space: nowrap;
        }

        .hiw-subtitle {
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: #475569;
          margin: 0;
          max-width: 660px;
        }

        .hiw-steps {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .hiw-card {
          border: 1px solid #eef2f7;
          background: rgba(255, 255, 255, 0.72);
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(2, 6, 23, 0.05);
          backdrop-filter: blur(8px);
        }

        .hiw-step {
          padding: 18px 18px 16px;
          text-align: left;
        }

        .hiw-stepTop {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .hiw-stepNum {
          font-family: "DM Serif Display", Georgia, serif;
          font-size: 12px;
          color: #64748b;
          letter-spacing: 0.12em;
          font-weight: 700;
        }

        .hiw-stepLine {
          height: 1px;
          flex: 1;
          background: #e2e8f0;
          opacity: 0.9;
        }

        .hiw-stepTitle {
          font-family: "DM Serif Display", Georgia, serif;
          font-size: 20px;
          line-height: 1.2;
          color: #0f172a;
          margin: 0 0 8px;
        }

        .hiw-stepBody {
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 13.5px;
          line-height: 1.7;
          color: #475569;
          margin: 0;
          max-width: 52ch;
        }

        .hiw-compare {
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
        }

        .hiw-col {
          padding: 18px;
        }

        .hiw-before {
          background: #fafafa;
          border-right: 1px solid #eef2f7;
        }

        .hiw-after {
          background: #f0fdf4;
        }

        .hiw-colHeader {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .hiw-badge {
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 999px;
          padding: 6px 12px;
          border: 1px solid transparent;
        }

        .hiw-badgeRed {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.18);
        }

        .hiw-badgeGreen {
          color: #16a34a;
          background: rgba(22, 163, 74, 0.08);
          border-color: rgba(22, 163, 74, 0.18);
        }

        .hiw-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 10px;
        }

        .hiw-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hiw-itemText {
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 13.5px;
          line-height: 1.55;
          color: #166534;
          font-weight: 500;
        }

        .hiw-itemBefore .hiw-itemText {
          color: #64748b;
          font-weight: 500;
        }

        .hiw-strike {
          text-decoration: line-through;
          text-decoration-color: rgba(239, 68, 68, 0.45);
        }

        .hiw-icon {
          width: 16px;
          height: 16px;
          display: inline-block;
          flex: 0 0 auto;
          border-radius: 999px;
          position: relative;
        }

        .hiw-x {
          background: rgba(239, 68, 68, 0.12);
        }
        .hiw-x::before,
        .hiw-x::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 10px;
          height: 2px;
          background: #ef4444;
          border-radius: 2px;
          transform-origin: center;
        }
        .hiw-x::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        .hiw-x::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        .hiw-check {
          background: rgba(34, 197, 94, 0.16);
        }
        .hiw-check::before {
          content: "";
          position: absolute;
          left: 5px;
          top: 7px;
          width: 7px;
          height: 4px;
          border-left: 2px solid #22c55e;
          border-bottom: 2px solid #22c55e;
          transform: rotate(-45deg);
          border-radius: 1px;
        }

        .hiw-ctaRow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 8px 0 2px;
          flex-wrap: wrap;
        }

        .hiw-cta {
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          background: #1d4ed8;
          border-radius: 999px;
          padding: 10px 18px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(29, 78, 216, 0.32);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .hiw-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(29, 78, 216, 0.45);
        }

        .hiw-ctaHint {
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 12.5px;
          color: #64748b;
        }

        @media (max-width: 860px) {
          .hiw-steps {
            grid-template-columns: 1fr;
          }
          .hiw-stepBody {
            max-width: none;
          }
          .hiw-compare {
            grid-template-columns: 1fr;
          }
          .hiw-before {
            border-right: none;
            border-bottom: 1px solid #eef2f7;
          }
          .hiw-title .hiw-accent {
            white-space: normal;
          }
        }
      `}</style>
    </section>
  );
}