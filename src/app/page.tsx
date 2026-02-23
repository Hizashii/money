"use client";

import { useScrollTracking } from "@/hooks/useScrollTracking";
import {
  SECTIONS,
  Navbar,
  Hero,
  ProductSection,
  InvoicesSection,
  HowItWorksSection,
  Footer,
} from "@/components/landing";

export default function LandingPage() {
  const { scrolled, activeSection, setSectionRef, scrollTo } =
    useScrollTracking(SECTIONS);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--background)" }}>
      <Navbar
        scrolled={scrolled}
        activeSection={activeSection}
        onNavClick={scrollTo}
      />
      <Hero onScrollToHowItWorks={() => scrollTo("how-it-works")} />
      <ProductSection sectionRef={setSectionRef("product")} />
      <InvoicesSection sectionRef={setSectionRef("invoices")} />
      <HowItWorksSection sectionRef={setSectionRef("how-it-works")} />
      <Footer />
    </div>
  );
}
