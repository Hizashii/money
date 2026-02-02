"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="rounded-2xl bg-white border border-slate-100 p-8 md:p-12 shadow-sm text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 grid place-items-center mb-6 shadow-lg shadow-blue-500/20">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
          Invoice PDF to Excel
        </h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
          Upload an invoice PDF and let AI extract the data, 
          visualize statistics, and export to Excel.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 grid place-items-center mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Upload</h3>
            <p className="text-sm text-slate-500">Drop your invoice PDF</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 grid place-items-center mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.5 6L20 10l-6.5 2L12 18l-1.5-6L4 10l6.5-2L12 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">AI Extract</h3>
            <p className="text-sm text-slate-500">OCR reads vendor, date, amounts</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 grid place-items-center mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Excel & Charts</h3>
            <p className="text-sm text-slate-500">View stats, export to Excel</p>
          </div>
        </div>

        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-slate-800 hover:shadow-xl active:scale-[0.98]"
        >
          Get Started
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
