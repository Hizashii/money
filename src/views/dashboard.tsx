"use client";

import React, { useState } from "react";
import Navbar from "@/components/nav";
import Sidenav from "@/components/sidenav";
import Footer from "@/components/footer";
import { Cards } from "@/components/cards";
import { LineChart } from "@mui/x-charts/LineChart";

export const Dashboard = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <div className="h-full">
          <Sidenav />
        </div>

        <main className="flex-1 overflow-auto p-6">
          <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                Quick Actions
              </h2>
              <span className="text-sm text-slate-500">Step {step} / 4</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Cards
                title="Upload"
                description="PDF invoices up to 10MB"
                buttonText={step === 1 ? "Upload Now" : "Uploaded ✓"}
                badge="Step 1"
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path d="M12 3l5 5h-3v6h-4V8H7l5-5z" />
                    <path d="M5 19h14v2H5z" />
                  </svg>
                }
                onClick={() => step === 1 && setStep(2)}
              />

              {step >= 2 && (
                <Cards
                  title="Processing Status"
                  description="See OCR + extraction progress in real-time."
                  buttonText={step === 2 ? "Mark Done" : "Done ✓"}
                  badge="Step 2"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 11h5v-2h-4V6h-2v7z" />
                    </svg>
                  }
                  onClick={() => step === 2 && setStep(3)}
                />
              )}

              {step >= 3 && (
                <Cards
                  title="AI Summary"
                  description="Quick highlights: total, vendor, date, VAT."
                  buttonText={step === 3 ? "Continue" : "Ready ✓"}
                  badge="Step 3"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d="M12 2l1.5 6L20 10l-6.5 2L12 18l-1.5-6L4 10l6.5-2L12 2z" />
                    </svg>
                  }
                  onClick={() => step === 3 && setStep(4)}
                >
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <LineChart
                      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                      series={[{ data: [2, 5.5, 2, 8.5, 1.5, 5] }]}
                      height={180}
                    />
                  </div>
                </Cards>
              )}

              {step >= 4 && (
                <Cards
                  title="Spreadsheet"
                  description="Review the extracted rows and export as CSV."
                  buttonText="Export CSV"
                  badge="Step 4"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 4v4h5V7H4zm0 6v4h5v-4H4zm7-6v4h9V7h-9zm0 6v4h9v-4h-9z" />
                    </svg>
                  }
                />
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <button
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                onClick={() => setStep(1)}
              >
                Reset
              </button>
              <button
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                onClick={() => setStep((s) => Math.min(4, s + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
