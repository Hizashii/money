"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#1d4ed8";
const LBL = "text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400";

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function AppSidebar() {
  const topIcons = [
    <svg key="d" width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" /><rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" /></svg>,
    <svg key="f" width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 8h6M9 16h4M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    <svg key="r" width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    <svg key="l" width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    <svg key="c" width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  ];
  const botIcons = [
    <svg key="u" width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    <svg key="s" width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.5-7.5-1.4 1.4M7 7 5.6 5.6M17 17l1.4 1.4M7 17l-1.4 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  ];
  return (
    <div style={{ position:"absolute", left:0, top:0, bottom:0, width:54, background:"#111113", borderRight:"1px solid rgba(255,255,255,0.05)", display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 0", zIndex:10, borderRadius:"1.95rem 0 0 1.95rem" }}>
      <div style={{ width:32, height:32, background:ACCENT, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18, flexShrink:0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 8h6M9 16h4M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:2, flex:1, width:"100%", padding:"0 8px" }}>
        {topIcons.map((icon, i) => (
          <button key={i} style={{ width:"100%", height:36, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:9, background: i===0?"rgba(255,255,255,0.1)":"transparent", color: i===0?"white":"rgba(255,255,255,0.28)", border:"none", cursor:"pointer" }}>
            {icon}
          </button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:2, width:"100%", padding:"0 8px", alignItems:"center" }}>
        {botIcons.map((icon, i) => (
          <button key={i} style={{ width:"100%", height:36, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:9, background:"transparent", color:"rgba(255,255,255,0.28)", border:"none", cursor:"pointer" }}>
            {icon}
          </button>
        ))}
        <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:9, fontWeight:700, marginTop:6 }}>JD</div>
      </div>
    </div>
  );
}

// ─── Cards ────────────────────────────────────────────────────────────────────
function OverviewCard() {
  const rows = [
    { id:"INV-2041", vendor:"Acme Corp",  amt:"€1,240", ok:true  },
    { id:"INV-2040", vendor:"TechSupply", amt:"€880",   ok:true  },
    { id:"INV-2039", vendor:"Officemart", amt:"€310",   ok:false },
  ];
  return (
    <div style={{ padding:22, height:"100%", display:"flex", flexDirection:"column", gap:14, overflow:"hidden", boxSizing:"border-box" }}>
      <div><p className={LBL}>Overview</p><p style={{ fontSize:13, fontWeight:600, color:"#1e293b", marginTop:2 }}>Invoice workflow</p></div>
      <div style={{ display:"flex", alignItems:"center" }}>
        {["Upload","Extract","Validate","Export"].map((s,i,a)=>(
          <div key={s} style={{ display:"flex", alignItems:"center", flex:i<a.length-1?1:undefined }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ width:20, height:20, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:i<3?ACCENT:"transparent", border:i<3?"none":"1.5px solid #cbd5e1" }}>
                {i<3?<svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>:<span style={{fontSize:8,color:"#94a3b8",fontWeight:500}}>4</span>}
              </div>
              <span style={{ fontSize:8, color:"#94a3b8", whiteSpace:"nowrap" }}>{s}</span>
            </div>
            {i<a.length-1&&<div style={{ flex:1, height:1, margin:"0 5px", marginBottom:14, background:i<2?"#bfdbfe":"#e2e8f0" }}/>}
          </div>
        ))}
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <p className={LBL} style={{ marginBottom:6 }}>Recent</p>
        {rows.map((r,i)=>(
          <div key={r.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:i<rows.length-1?"1px solid #f1f5f9":"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:r.ok?"#22c55e":"#f59e0b", flexShrink:0, display:"block" }}/>
              <span style={{ fontSize:11, fontWeight:500, color:"#334155" }}>{r.id}</span>
              <span style={{ fontSize:10, color:"#94a3b8" }}>{r.vendor}</span>
            </div>
            <span style={{ fontSize:11, fontWeight:600, color:"#475569" }}>{r.amt}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
        {[["142","Processed"],["127","Valid"],["15","Issues"]].map(([v,l])=>(
          <div key={l} style={{ background:"#f8fafc", borderRadius:10, padding:"8px 6px", textAlign:"center" }}>
            <p style={{ fontSize:15, fontWeight:600, color:"#1e293b" }}>{v}</p>
            <p style={{ fontSize:8, color:"#94a3b8", marginTop:2 }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentCard() {
  const bars=[38,52,44,68,57,82,71];
  const mons=["Jan","Feb","Mar","Apr","May","Jun","Jul"];
  const max=Math.max(...bars);
  return (
    <div style={{ padding:22, height:"100%", display:"flex", flexDirection:"column", gap:14, overflow:"hidden", boxSizing:"border-box" }}>
      <div><p className={LBL}>Payment</p><p style={{ fontSize:13, fontWeight:600, color:"#1e293b", marginTop:2 }}>Monthly volume</p></div>
      <div style={{ flex:1, display:"flex", alignItems:"flex-end", gap:4, minHeight:60 }}>
        {bars.map((v,i)=>(
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <div style={{ width:"100%", borderRadius:"3px 3px 0 0", background:i===bars.length-1?ACCENT:"#dbeafe", height:`${(v/max)*100}%`, minHeight:3 }}/>
            <span style={{ fontSize:7, color:"#94a3b8" }}>{mons[i]}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
        {[["30d","Net terms"],["€84k","This quarter"]].map(([v,l])=>(
          <div key={l} style={{ background:"#f8fafc", borderRadius:10, padding:10 }}>
            <p style={{ fontSize:16, fontWeight:600, color:"#1e293b" }}>{v}</p>
            <p style={{ fontSize:9, color:"#94a3b8", marginTop:2 }}>{l}</p>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {[["Bank transfer",68],["Card",22],["Other",10]].map(([l,p])=>(
          <div key={l as string} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ flex:1, height:3, background:"#f1f5f9", borderRadius:99, overflow:"hidden" }}>
              <div style={{ width:`${p}%`, height:"100%", background:ACCENT, borderRadius:99 }}/>
            </div>
            <span style={{ fontSize:9, color:"#94a3b8", whiteSpace:"nowrap", width:88, textAlign:"right" }}>{l} · {p}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegitimacyCard() {
  const checks=[
    {label:"IBAN checksum",ok:true},
    {label:"Math totals",ok:true},
    {label:"Beneficiary match",ok:true},
    {label:"VAT number",ok:false},
  ];
  const r=30,circ=2*Math.PI*r,off=circ*(1-0.87);
  return (
    <div style={{ padding:22, height:"100%", display:"flex", flexDirection:"column", gap:14, overflow:"hidden", boxSizing:"border-box" }}>
      <div><p className={LBL}>Legitimacy</p><p style={{ fontSize:13, fontWeight:600, color:"#1e293b", marginTop:2 }}>Validation score</p></div>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ position:"relative", flexShrink:0 }}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={r} fill="none" stroke="#f1f5f9" strokeWidth="6"/>
            <circle cx="36" cy="36" r={r} fill="none" stroke={ACCENT} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 36 36)"/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:12, fontWeight:600, color:"#1e293b" }}>87%</span>
          </div>
        </div>
        <div>
          <p style={{ fontSize:12, fontWeight:600, color:"#334155" }}>High trust score</p>
          <p style={{ fontSize:10, color:"#94a3b8", marginTop:3 }}>5 checks · 1 warning</p>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        {checks.map((c,i)=>(
          <div key={c.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 0", borderBottom:i<checks.length-1?"1px solid #f1f5f9":"none" }}>
            <span style={{ fontSize:11, color:"#475569" }}>{c.label}</span>
            <span style={{ fontSize:10, fontWeight:600, color:c.ok?"#16a34a":"#d97706" }}>{c.ok?"Pass":"Warn"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatisticsCard() {
  const spark=[12,18,14,22,19,28,24,31,27,35];
  const maxS=Math.max(...spark);
  const W=100,H=72;
  const pts=spark.map((v,i)=>`${(i/(spark.length-1))*W},${H-(v/maxS)*H}`).join(" ");
  const area=`0,${H} ${pts} ${W},${H}`;
  return (
    <div style={{ padding:22, height:"100%", display:"flex", flexDirection:"column", gap:14, overflow:"hidden", boxSizing:"border-box" }}>
      <div><p className={LBL}>Statistics</p><p style={{ fontSize:13, fontWeight:600, color:"#1e293b", marginTop:2 }}>Performance</p></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:"#f1f5f9", borderRadius:12, overflow:"hidden" }}>
        {[["89%","+4%","Success rate"],["23","−8","Issues flagged"],["1.2s","−0.3s","Avg. time"],["61","+12","Exports"]].map(([v,t,l])=>(
          <div key={l} style={{ background:"white", padding:"10px 12px" }}>
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between" }}>
              <p style={{ fontSize:15, fontWeight:600, color:"#1e293b" }}>{v}</p>
              <span style={{ fontSize:9, fontWeight:600, color:"#16a34a" }}>{t}</span>
            </div>
            <p style={{ fontSize:9, color:"#94a3b8", marginTop:2 }}>{l}</p>
          </div>
        ))}
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
        <p className={LBL}>Export trend</p>
        <div style={{ flex:1, background:"#f8fafc", borderRadius:12, overflow:"hidden", padding:10 }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width:"100%", height:"100%" }}>
            <defs>
              <linearGradient id="sg4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity="0.13"/>
                <stop offset="100%" stopColor={ACCENT} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <polygon points={area} fill="url(#sg4)"/>
            <polyline points={pts} fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
interface HeroProps { onScrollToHowItWorks?: () => void }
const fadeUp = { initial:{opacity:0,y:16}, animate:{opacity:1,y:0} };

// Unique sine-wave parameters per card — different frequencies + phase offsets
// so each card drifts on its own independent rhythm
const FLOAT_PARAMS = [
  { yFreq: 0.00042, rFreq: 0.00028, yAmp: 9,  rAmp: 0.28, phase: 0.00 },
  { yFreq: 0.00037, rFreq: 0.00031, yAmp: 11, rAmp: 0.22, phase: 1.80 },
  { yFreq: 0.00051, rFreq: 0.00024, yAmp: 8,  rAmp: 0.32, phase: 3.60 },
  { yFreq: 0.00044, rFreq: 0.00035, yAmp: 10, rAmp: 0.25, phase: 5.10 },
];

export function Hero({ onScrollToHowItWorks }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const screenRef  = useRef<HTMLDivElement>(null);
  const tabletRef  = useRef<HTMLDivElement>(null);
  const c0 = useRef<HTMLDivElement>(null);
  const c1 = useRef<HTMLDivElement>(null);
  const c2 = useRef<HTMLDivElement>(null);
  const c3 = useRef<HTMLDivElement>(null);
  const cardRefs = [c0, c1, c2, c3];

  useEffect(() => {
    const GAP     = 10;
    const SIDEBAR = 54;

    // ── Helpers ───────────────────────────────────────────────────────────────
    const getFinalPos = () => {
      const screen = screenRef.current;
      if (!screen) return null;
      const rect = screen.getBoundingClientRect();
      const sTop = window.scrollY + rect.top;
      const uL   = rect.left + SIDEBAR;
      const uW   = rect.width - SIDEBAR;
      const cW   = (uW - GAP * 3) / 2;
      const cH   = (rect.height - GAP * 3) / 2;
      return [
        { l: uL + GAP,        t: sTop + GAP,        w: cW, h: cH },
        { l: uL + GAP*2+cW,   t: sTop + GAP,        w: cW, h: cH },
        { l: uL + GAP,        t: sTop + GAP*2+cH,   w: cW, h: cH },
        { l: uL + GAP*2+cW,   t: sTop + GAP*2+cH,   w: cW, h: cH },
      ];
    };

    const FLOAT_OFFSETS = [
      { dx:-340, dy:-260 },
      { dx: 340, dy:-260 },
      { dx:-340, dy: 200 },
      { dx: 340, dy: 200 },
    ];

    const easeInOut = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

    const getScrollProgress = () => {
      const section = sectionRef.current;
      if (!section) return 0;
      const rect = section.getBoundingClientRect();
      return Math.max(0, Math.min(-rect.top / (window.innerHeight * 0.35), 1));
    };

    // ── Per-card tilt state (updated by mouse listeners, read by rAF loop) ───
    const tiltState = cardRefs.map(() => ({
      rx: 0, ry: 0,       // current (lerped)
      txRx: 0, txRy: 0,   // target
      hovered: false,
    }));

    // ── Single rAF loop: position + float + tilt + shadow ────────────────────
    let floatRaf = 0;
    let startTime: number | null = null;

    const loop = (now: number) => {
      if (startTime === null) startTime = now;
      const t = now - startTime; // ms elapsed

      const ep  = easeInOut(getScrollProgress()); // 0..1, eased
      // floatAmp smoothly fades from 1 → 0 as cards land.
      // We smooth it slightly so it doesn't snap if someone scrolls fast.
      const floatAmp = 1 - ep;

      const pos       = getFinalPos();
      const scrollTop = window.scrollY;

      if (pos) {
        cardRefs.forEach((ref, i) => {
          if (!ref.current) return;

          // 1. Scroll-driven fly-in offset
          const dx = FLOAT_OFFSETS[i].dx * (1 - ep);
          const dy = FLOAT_OFFSETS[i].dy * (1 - ep);

          // 2. Sine-wave float — Y position + slight rotation
          const p      = FLOAT_PARAMS[i];
          const floatY = Math.sin(t * p.yFreq + p.phase)           * p.yAmp * floatAmp;
          const floatR = Math.sin(t * p.rFreq + p.phase + 1.2)     * p.rAmp * floatAmp;

          // 3. Mouse tilt — lerp toward target
          const ts = tiltState[i];
          const lf = ts.hovered ? 0.10 : 0.06; // faster when hovering
          ts.rx += (ts.txRx - ts.rx) * lf;
          ts.ry += (ts.txRy - ts.ry) * lf;

          // 4. Compose transform (tilt + float rotation)
          const transform = [
            `perspective(800px)`,
            `rotateX(${ts.rx}deg)`,
            `rotateY(${ts.ry}deg)`,
            `rotate(${floatR}deg)`,
          ].join(" ");

          // 5. Dynamic box-shadow — lifts when floating or hovered
          const lift      = ts.hovered ? 32 : 12 + Math.abs(floatY) * 0.9;
          const shadowOp  = ts.hovered ? 0.16 : 0.06 + floatAmp * 0.05;
          const shadowX   = -ts.ry * 0.55;
          const shadowYOff =  ts.rx * 0.55;

          Object.assign(ref.current.style, {
            position:        "fixed",
            zIndex:          "30",
            width:           pos[i].w + "px",
            height:          pos[i].h + "px",
            left:            (pos[i].l + dx) + "px",
            // floatY is added to top — moves card up/down organically
            top:             (pos[i].t - scrollTop + dy + floatY) + "px",
            borderRadius:    "14px",
            opacity:         "1",
            pointerEvents:   "auto",
            willChange:      "transform, left, top",
            transformOrigin: "center center",
            transform,
            boxShadow: `
              ${shadowX}px ${shadowYOff + lift}px ${lift * 2.2}px rgba(0,0,0,${shadowOp}),
              0 2px 8px rgba(0,0,0,0.04)
            `,
          });
        });
      }

      floatRaf = requestAnimationFrame(loop);
    };

    floatRaf = requestAnimationFrame(loop);

    // ── GSAP: tablet entrance only ────────────────────────────────────────────
    const ctx = gsap.context(() => {
      gsap.set(tabletRef.current, { y: 40, opacity: 0 });
      gsap.to(tabletRef.current, {
        y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3,
      });

      // ScrollTrigger still needed to keep GSAP's scroll system aware
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=400",
      });
    }, sectionRef);

    // ── Mouse tilt listeners ──────────────────────────────────────────────────
    const tiltCleanups: (() => void)[] = [];

    cardRefs.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const nx = (e.clientX - cx) / (rect.width  / 2); // -1..1
        const ny = (e.clientY - cy) / (rect.height / 2);
        const MAX = 9;
        tiltState[i].txRx =  ny * MAX;
        tiltState[i].txRy = -nx * MAX;
      };

      const onEnter = () => { tiltState[i].hovered = true; };
      const onLeave = () => {
        tiltState[i].hovered = false;
        tiltState[i].txRx = 0;
        tiltState[i].txRy = 0;
      };

      el.addEventListener("mousemove",  onMove  as EventListener);
      el.addEventListener("mouseenter", onEnter as EventListener);
      el.addEventListener("mouseleave", onLeave as EventListener);

      tiltCleanups.push(() => {
        el.removeEventListener("mousemove",  onMove  as EventListener);
        el.removeEventListener("mouseenter", onEnter as EventListener);
        el.removeEventListener("mouseleave", onLeave as EventListener);
      });
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(floatRaf);
      ctx.revert();
      tiltCleanups.forEach(fn => fn());
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "105vh",
        background: "radial-gradient(ellipse 120% 40% at 50% 0%, #eaebf3 0%, #f4f4f8 50%, #fafafa 80%, #fff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"55vw", height:"40vh", pointerEvents:"none", background:"radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)", filter:"blur(52px)" }}/>

      {/* ── Hero text ── */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"0 24px", paddingTop:"clamp(80px, 12vh, 140px)" }}>
        <motion.div
          initial="initial" animate="animate"
          transition={{ staggerChildren:0.13, delayChildren:0.1 }}
          style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, maxWidth:680 }}
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration:1, ease:[0.16,1,0.3,1] }}
            style={{
              fontFamily:"'DM Serif Display', Georgia, serif",
              fontSize:"clamp(3rem, 6vw, 5.5rem)",
              fontWeight:700,
              lineHeight:1.04,
              letterSpacing:"-0.025em",
              color:"#0a0a14",
              margin:0,
            }}
          >
            Stop wasting time<br />on invoices.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration:1, ease:[0.16,1,0.3,1] }}
            style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:17, color:"#64748b", lineHeight:1.7, maxWidth:400, margin:0 }}
          >
            Extract and validate key invoice fields, then approve and export in minutes.
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration:1, ease:[0.16,1,0.3,1] }}>
            <Link href="/upload">
              <motion.span
                whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                style={{ display:"inline-block", background:"#0f172a", color:"white", borderRadius:999, padding:"14px 36px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans', system-ui, sans-serif", boxShadow:"0 2px 4px rgba(0,0,0,0.10), 0 6px 20px rgba(15,23,42,0.16)" }}
              >
                Free demo
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Tablet ── */}
      <div style={{ marginTop:"clamp(48px, 8vh, 96px)", padding:"0 clamp(12px, 3vw, 40px)", position:"relative", zIndex:5 }}>
        <div ref={tabletRef} style={{ maxWidth:1320, margin:"0 auto" }}>
          <div style={{ position:"relative", borderRadius:"2.8rem", background:"#161618", padding:15, boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.07), 0 0 0 1.5px rgba(0,0,0,0.55), 0 48px 110px rgba(0,0,0,0.32), 0 14px 32px rgba(0,0,0,0.20)" }}>
            {/* Volume left */}
            <div style={{ position:"absolute", left:-5, top:"22%", display:"flex", flexDirection:"column", gap:10 }}>
              {[28,44,44].map((h,i)=>(
                <div key={i} style={{ width:5, height:h, background:"#252528", borderRadius:"2px 0 0 2px", boxShadow:"-1px 0 0 rgba(255,255,255,0.04)" }}/>
              ))}
            </div>
            {/* Power right */}
            <div style={{ position:"absolute", right:-5, top:"28%" }}>
              <div style={{ width:5, height:60, background:"#252528", borderRadius:"0 2px 2px 0", boxShadow:"1px 0 0 rgba(255,255,255,0.04)" }}/>
            </div>
            {/* Camera */}
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:9, height:10, marginBottom:4 }}>
              <div style={{ width:52, height:3, background:"rgba(255,255,255,0.07)", borderRadius:2 }}/>
              <div style={{ width:7, height:7, background:"rgba(255,255,255,0.09)", borderRadius:"50%" }}/>
            </div>
            {/* Screen */}
            <div ref={screenRef} style={{ borderRadius:"2.05rem", aspectRatio:"16/9", background:"#f5f5f7", position:"relative", overflow:"hidden" }}>
              <AppSidebar />
            </div>
          </div>
        </div>
      </div>

      <div style={{ height:"8vh" }} aria-hidden />

      {/* ── 4 Cards — all animation handled by the rAF loop above ── */}
      {([
        <OverviewCard   key="tl" />,
        <PaymentCard    key="tr" />,
        <LegitimacyCard key="bl" />,
        <StatisticsCard key="br" />,
      ]).map((content, i) => (
        <div
          key={i}
          ref={cardRefs[i]}
          style={{
            position:   "fixed",
            zIndex:     30,
            background: "white",
            border:     "0.5px solid rgba(0,0,0,0.07)",
            overflow:   "hidden",
            // All other styles are written live by the loop
          }}
        >
          {content}
        </div>
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}
