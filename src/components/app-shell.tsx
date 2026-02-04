"use client";

import React from "react";
import Navbar from "@/components/nav";
import Footer from "@/components/footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}
