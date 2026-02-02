"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/nav";
import Sidenav from "@/components/sidenav";
import Footer from "@/components/footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active =
    pathname === "/"
      ? "Dashboard"
      : pathname === "/upload"
        ? "Upload PDF"
        : pathname === "/invoices"
          ? "Invoices"
          : "Dashboard";

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-slate-50 transition-colors duration-200">
      <Navbar />
      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidenav active={active} />
        <main className="flex-1 overflow-auto min-w-0 animate-in fade-in duration-300">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
