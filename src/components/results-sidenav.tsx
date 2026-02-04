"use client";

import React from "react";

export const SIDEBAR_SECTIONS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "sender-identity", label: "Sender Identity" },
  { id: "invoice-details", label: "Invoice Details" },
  { id: "amounts", label: "Amounts" },
  { id: "payment", label: "Payment" },
  { id: "legitimacy", label: "Legitimacy" },
  { id: "statistics", label: "Statistics" },
  { id: "chart", label: "Net vs VAT" },
  { id: "extracted-data", label: "Extracted Data" },
] as const;

export type SidebarSectionId = (typeof SIDEBAR_SECTIONS)[number]["id"];

interface ResultsSidenavProps {
  activeSection: SidebarSectionId;
  onSectionChange: (id: SidebarSectionId) => void;
}

export default function ResultsSidenav({ activeSection, onSectionChange }: ResultsSidenavProps) {
  return (
    <aside className="w-56 shrink-0 border-r border-slate-200/60 bg-white flex flex-col">
      <div className="p-4 border-b border-slate-200/60">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sections</p>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <ul className="space-y-0.5">
          {SIDEBAR_SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSectionChange(id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                  activeSection === id
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
