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

export function ProductSection({ sectionRef }: ProductSectionProps) {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        }
      );

      // Hover: lift up
      const onEnter = () => gsap.to(card, { y: -4, duration: 0.2, ease: "power2.out", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" });
      const onLeave = () => gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" });

      card!.addEventListener("mouseenter", onEnter);
      card!.addEventListener("mouseleave", onLeave);

      return () => {
        card!.removeEventListener("mouseenter", onEnter);
        card!.removeEventListener("mouseleave", onLeave);
      };
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      id="product"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
            What is Incheck?
          </h2>
          <p className="mt-4 text-lg text-slate-500 text-center max-w-2xl mx-auto">
            A lightweight tool that reads your invoice PDFs, extracts key
            fields, checks for issues, and lets you export everything to Excel
            or CSV.
          </p>
        </AnimatedSection>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_FEATURES.map((item, i) => (
            <AnimatedSection key={item.title}>
              <div
                ref={(el) => { cardsRef.current[i] = el; }}
                className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm hover:border-slate-200 transition-colors duration-300 flex flex-col items-center text-center"
              >
                <div
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 border border-slate-100`}
                >
                  <ProductIcon iconKey={item.iconKey} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
