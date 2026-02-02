"use client";

import React, { useState, useCallback } from "react";
import { extractPdfs, downloadExcel, type InvoiceRow } from "@/lib/api";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";

type Stage = "upload" | "processing" | "results";

export default function UploadPage() {
  const [stage, setStage] = useState<Stage>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InvoiceRow[]>([]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = Array.from(e.dataTransfer.files).find(
      (f) => f.type === "application/pdf"
    );
    if (f) setFile(f);
  }, []);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
    e.target.value = "";
  }, []);

  const submit = async () => {
    if (!file) return;
    setError(null);
    setStage("processing");

    try {
      const rows = await extractPdfs([file]);
      setData(rows);
      setTimeout(() => setStage("results"), 1200);
    } catch (err) {
      setError("Failed to process PDF. Please try again.");
      setStage("upload");
    }
  };

  const reset = () => {
    setStage("upload");
    setFile(null);
    setData([]);
    setError(null);
  };

  const totals = data.map((r) => parseFloat(r.total.replace(/,/g, "")) || 0);
  const vats = data.map((r) => parseFloat(r.vat.replace(/,/g, "")) || 0);
  const grandTotal = totals.reduce((a, b) => a + b, 0);
  const totalVat = vats.reduce((a, b) => a + b, 0);
  const netAmount = grandTotal - totalVat;

  const handleExportExcel = async () => {
    try {
      await downloadExcel(data);
    } catch {
      setError("Failed to export Excel. Please try again.");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* UPLOAD STAGE */}
      {stage === "upload" && (
        <div className="animate-fade-in">
          <div className="rounded-2xl bg-white border border-slate-100 p-8 md:p-12 shadow-sm max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 grid place-items-center mb-4">
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                Upload Invoice PDF
              </h1>
              <p className="text-slate-500 max-w-md mx-auto">
                Upload your invoice and our AI will extract key data using OCR,
                organize it into a spreadsheet, and show you detailed statistics.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 grid place-items-center font-semibold text-xs">1</span>
                <div>
                  <p className="font-medium text-slate-900">Upload PDF</p>
                  <p className="text-slate-500">Select or drag your invoice file</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 grid place-items-center font-semibold text-xs">2</span>
                <div>
                  <p className="font-medium text-slate-900">AI Processing</p>
                  <p className="text-slate-500">OCR extracts vendor, date, amounts, VAT</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 grid place-items-center font-semibold text-xs">3</span>
                <div>
                  <p className="font-medium text-slate-900">View Results</p>
                  <p className="text-slate-500">See data sheet, charts, and export to Excel</p>
                </div>
              </div>
            </div>

            <div
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              className={`
                relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer
                ${drag ? "border-blue-400 bg-blue-50/50" : file ? "border-green-300 bg-green-50/30" : "border-slate-200 bg-slate-50/50 hover:border-slate-300"}
              `}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={onFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-left">
                    <p className="font-medium text-slate-900 truncate max-w-xs">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ) : (
                <>
                  <svg className="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {drag ? "Drop PDF here" : "Click to select or drag & drop"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">PDF files only, up to 10MB</p>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</div>
            )}

            <button
              onClick={submit}
              disabled={!file}
              className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Extract with AI
            </button>
          </div>
        </div>
      )}

      {stage === "processing" && (
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.5 6L20 10l-6.5 2L12 18l-1.5-6L4 10l6.5-2L12 2z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">Processing your invoice...</h2>
          <p className="mt-2 text-slate-500">Extracting data with OCR and AI</p>
          <div className="mt-6 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {stage === "results" && (
        <div className="animate-fade-in space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Extraction Complete
              </h1>
              <p className="text-slate-500 mt-1">
                {data.length} invoice row{data.length !== 1 ? "s" : ""} extracted from your PDF
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Upload Another
              </button>
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Excel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Grand Total</p>
              <p className="text-2xl font-bold text-slate-900">${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Total VAT</p>
              <p className="text-2xl font-bold text-red-600">${totalVat.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Net Amount</p>
              <p className="text-2xl font-bold text-green-600">${netAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Extracted Data</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">#</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Vendor</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Total</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">VAT</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-400">{i + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.vendor}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{row.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 tabular-nums">{row.total}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 tabular-nums">{row.vat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {data.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Amount Breakdown</h2>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: netAmount, label: "Net", color: "#22c55e" },
                        { id: 1, value: totalVat, label: "VAT", color: "#ef4444" },
                      ],
                      highlightScope: { fade: "global", highlight: "item" },
                      innerRadius: 40,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  height={250}
                />
              </div>

              <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">By Vendor</h2>
                <BarChart
                  xAxis={[{ scaleType: "band", data: data.map((r) => r.vendor.slice(0, 12)) }]}
                  series={[
                    { data: totals, label: "Total", color: "#3b82f6" },
                    { data: vats, label: "VAT", color: "#ef4444" },
                  ]}
                  height={250}
                />
              </div>
            </div>
          )}
        </div>
      )}

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
