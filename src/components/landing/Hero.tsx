"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

interface HeroProps {
  onScrollToHowItWorks?: () => void;
}

export function Hero({ onScrollToHowItWorks }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const cardTLRef = useRef<HTMLDivElement>(null);
  const cardTRRef = useRef<HTMLDivElement>(null);
  const cardBLRef = useRef<HTMLDivElement>(null);
  const cardBRRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const gap = 8; // px gap between cards (matches the padding inside screen)

      const positionCards = () => {
        const screen = screenRef.current;
        if (!screen) return;

        const rect = screen.getBoundingClientRect();
        const scrollTop = window.scrollY;

        // Card dimensions — exactly half the screen minus gap
        const cardW = (rect.width - gap * 3) / 2;
        const cardH = (rect.height - gap * 3) / 2;

        const screenLeft = rect.left;
        const screenTop = rect.top + scrollTop;

        // Final positions (inside the screen)
        const positions = {
          TL: { left: screenLeft + gap, top: screenTop + gap, width: cardW, height: cardH },
          TR: { left: screenLeft + gap * 2 + cardW, top: screenTop + gap, width: cardW, height: cardH },
          BL: { left: screenLeft + gap, top: screenTop + gap * 2 + cardH, width: cardW, height: cardH },
          BR: { left: screenLeft + gap * 2 + cardW, top: screenTop + gap * 2 + cardH, width: cardW, height: cardH },
        };

        // Outward offsets for starting position
        const outset = 180;

        const cards = [
          { ref: cardTLRef, pos: positions.TL, ox: -outset, oy: -outset },
          { ref: cardTRRef, pos: positions.TR, ox: outset, oy: -outset },
          { ref: cardBLRef, pos: positions.BL, ox: -outset, oy: outset },
          { ref: cardBRRef, pos: positions.BR, ox: outset, oy: outset },
        ];

        cards.forEach(({ ref, pos, ox, oy }) => {
          if (!ref.current) return;
          gsap.set(ref.current, {
            position: "fixed",
            width: pos.width,
            height: pos.height,
            left: pos.left,
            top: pos.top - scrollTop, // fixed positioning uses viewport coords
            x: ox,
            y: oy,
            borderRadius: 16,
          });
        });

        return cards.map(({ ref, pos }) => ({ ref, finalTop: pos.top - scrollTop }));
      };

      // Wait for layout then position
      requestAnimationFrame(() => {
        const cards = positionCards();

        // Idle float
        const floats = [
          gsap.to(cardTLRef.current, { y: "-=10", x: "-=6", duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" }),
          gsap.to(cardTRRef.current, { y: "-=8", x: "+=8", duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 }),
          gsap.to(cardBLRef.current, { y: "+=10", x: "-=7", duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 }),
          gsap.to(cardBRRef.current, { y: "+=9", x: "+=6", duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8 }),
        ];

        // Scrubbed scroll animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=500",
            scrub: 1.2,
            pin: stickyRef.current,
            onUpdate: (self) => {
              if (self.progress > 0.02) {
                floats.forEach(f => f.pause());
              } else {
                floats.forEach(f => f.resume());
              }
            },
          },
        });

        tl.to(cardTLRef.current, { x: 0, y: 0, ease: "power2.out" }, 0);
        tl.to(cardTRRef.current, { x: 0, y: 0, ease: "power2.out" }, 0.05);
        tl.to(cardBLRef.current, { x: 0, y: 0, ease: "power2.out" }, 0.1);
        tl.to(cardBRRef.current, { x: 0, y: 0, ease: "power2.out" }, 0.15);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ height: "160vh" }}
    >
      {/* Pinned content */}
      <div
        ref={stickyRef}
        className="relative w-full min-h-screen flex flex-col"
        style={{
          background:
            "radial-gradient(ellipse 110% 65% at 50% 0%, #e6e6f6 0%, #f0f0fa 35%, #f9f9ff 70%, #ffffff 100%)",
          overflow: "clip",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Blobs */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[15%] w-72 h-72 rounded-full bg-violet-200/30 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-[12%] w-56 h-56 rounded-full bg-indigo-200/25 blur-3xl pointer-events-none"
        />

        {/* Hero text */}
        <div className="relative flex flex-col items-center text-center px-6 pt-28 pb-16">
          <motion.div
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.1, delayChildren: 0.05 }}
            className="space-y-6 max-w-2xl"
          >
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2.8rem,6vw,5rem)] font-black leading-[1.05] tracking-tight text-slate-950"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Stop wasting time
              <br />
              on invoices.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-md mx-auto"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
              Extract and validate the important fields from digital invoices,
              then approve and export in minutes.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="pt-2"
            >
              <Link href="/upload">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block rounded-full bg-slate-950 px-9 py-4 text-sm font-semibold text-white cursor-pointer"
                  style={{
                    boxShadow: "0 6px 24px rgba(15,23,42,0.20)",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  Free demo
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Tablet — screen ref is what cards align to */}
        <div className="relative mx-auto w-full flex-1 flex flex-col pb-10"
          style={{ maxWidth: "860px", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 -z-10 blur-3xl opacity-40"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 60%, #c8c8ee, transparent)" }}
          />

          {/* Tablet bezel */}
          <div
            className="rounded-[2.2rem] bg-zinc-900 p-3 flex-1 flex flex-col"
            style={{
              boxShadow: "0 40px 100px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Screen — this is the ref we measure */}
            <div
              ref={screenRef}
              className="rounded-[1.6rem] bg-[#f4f4f6] flex-1"
            />
          </div>
        </div>

        {/* The 4 cards — rendered here but positioned fixed via GSAP */}
        <div
          ref={cardTLRef}
          className="bg-white border border-slate-100"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.09)", position: "fixed", zIndex: 20 }}
        />
        <div
          ref={cardTRRef}
          className="bg-white border border-slate-100"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.09)", position: "fixed", zIndex: 20 }}
        />
        <div
          ref={cardBLRef}
          className="bg-white border border-slate-100"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.09)", position: "fixed", zIndex: 20 }}
        />
        <div
          ref={cardBRRef}
          className="bg-white border border-slate-100"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.09)", position: "fixed", zIndex: 20 }}
        />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  );
}
