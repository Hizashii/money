"use client";

import React from "react";
import AppSidenav from "@/components/app-sidenav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex bg-slate-50">
      <AppSidenav />
      <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
