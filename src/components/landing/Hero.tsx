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
    <svg key="d" width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity=".35"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity=".35"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity=".35"/></svg>,
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
              <div style={{ width:`${p}%`, height:"100%", background:ACCENT, opacity:0.25+(p as number)/130, borderRadius:99 }}/>
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
    let raf = 0;
    const GAP     = 10;
    const SIDEBAR = 54;

    // Final positions inside screen
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

    // Float offsets — cards spread outward from the tablet center
    const FLOATS = [
      { dx:-200, dy:-160 },
      { dx: 200, dy:-160 },
      { dx:-200, dy: 120 },
      { dx: 200, dy: 120 },
    ];

    // Set card geometry without affecting x/y
    const placeCards = (progress: number) => {
      const pos = getFinalPos();
      if (!pos) return;
      const scrollTop = window.scrollY;
      const p = Math.min(Math.max(progress, 0), 1);
      const ease = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t; // easeInOut
      const ep = ease(p);

      cardRefs.forEach((ref, i) => {
        if (!ref.current) return;
        const dx = FLOATS[i].dx * (1 - ep);
        const dy = FLOATS[i].dy * (1 - ep);
        const sc = 0.94 + 0.06 * ep;
        const op = 0.75 + 0.25 * ep;
        const br = 18 - 6 * ep;

        Object.assign(ref.current.style, {
          position:   "fixed",
          zIndex:     "30",
          width:      pos[i].w + "px",
          height:     pos[i].h + "px",
          left:       (pos[i].l + dx) + "px",
          top:        (pos[i].t - scrollTop + dy) + "px",
          borderRadius: br + "px",
          transform:  `scale(${sc})`,
          opacity:    String(op),
          pointerEvents: "auto",
        });
      });
    };

    const ctx = gsap.context(() => {
      // Tablet entrance
      gsap.set(tabletRef.current, { y: 40, opacity: 0 });
      gsap.to(tabletRef.current, {
        y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3,
      });

      // Cards driven by scroll progress
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=700",
        onUpdate: (self) => {
          placeCards(self.progress);
        },
      });

      // Initial state (progress = 0)
      requestAnimationFrame(() => placeCards(0));

      const onScroll = () => {
        // reposition on every scroll tick (handles scroll within ST range too)
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const pos = getFinalPos();
          if (!pos) return;
          const scrollTop = window.scrollY;
          const section = sectionRef.current;
          if (!section) return;
          const sRect = section.getBoundingClientRect();
          const sH    = section.offsetHeight;
          const triggerEnd = sH - window.innerHeight;
          const rawProg = Math.max(0, Math.min(-sRect.top / Math.max(triggerEnd, 1), 1));
          placeCards(rawProg);
        });
      };

      const onResize = () => {
        ScrollTrigger.refresh();
        placeCards(0);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(raf);
        st.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        // Tall enough for scroll animation + content below
        minHeight: "220vh",
        background: "radial-gradient(ellipse 120% 40% at 50% 0%, #eaebf3 0%, #f4f4f8 50%, #fafafa 80%, #fff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:"55vw", height:"40vh", pointerEvents:"none", background:"radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)", filter:"blur(52px)" }}/>

      {/* ── Hero text — pushed well down ── */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"0 24px", paddingTop:"clamp(120px, 18vh, 200px)" }}>
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

      {/* ── Tablet — pushed further down ── */}
      <div
        style={{
          marginTop:"clamp(80px, 14vh, 160px)",
          padding:"0 clamp(12px, 3vw, 40px)",
          position:"relative",
          zIndex:5,
        }}
      >
        <div ref={tabletRef} style={{ maxWidth:1320, margin:"0 auto" }}>
          {/* Device shell */}
          <div
            style={{
              position:"relative",
              borderRadius:"2.8rem",
              background:"#161618",
              padding:15,
              boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.07), 0 0 0 1.5px rgba(0,0,0,0.55), 0 48px 110px rgba(0,0,0,0.32), 0 14px 32px rgba(0,0,0,0.20)",
            }}
          >
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
            <div
              ref={screenRef}
              style={{
                borderRadius:"2.05rem",
                aspectRatio:"16/9",
                background:"#f5f5f7",
                position:"relative",
                overflow:"hidden",
              }}
            >
              <AppSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Extra scroll room */}
      <div style={{ height:"60vh" }} aria-hidden />

      {/* ── 4 Cards (GSAP-managed via inline styles above) ── */}
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
            position:"fixed",
            zIndex:30,
            background:"white",
            border:"0.5px solid rgba(0,0,0,0.07)",
            boxShadow:"0 2px 8px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.09)",
            overflow:"hidden",
            willChange:"transform, left, top, opacity",
            transformOrigin:"center center",
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
