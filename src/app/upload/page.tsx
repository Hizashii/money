"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  extractPdfs,
  downloadExcel,
  downloadCsv,
  extractionsToRows,
  type InvoiceExtraction,
  type InvoiceRow,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/api";
import { saveExtraction, loadExtraction } from "@/lib/session";
import { MAX_FILE_SIZE_LABEL } from "@/lib/constants";
import { PieChart } from "@mui/x-charts/PieChart";
import type { LegitimacyStatus } from "@/lib/extract";
import InvoiceDetailPanel, { type FixableField } from "@/components/invoice-detail-panel";

type Stage = "upload" | "processing" | "results";
type StatusFilter = "all" | "review" | "high-risk" | "ok";

/* Status pill styling */
const STATUS_PILL: Record<LegitimacyStatus, string> = {
  Safe: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Needs Review": "bg-amber-50 text-amber-700 border-amber-200",
  "High Risk": "bg-rose-50 text-rose-700 border-rose-200",
};

function StatusBadge({ status }: { status: LegitimacyStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${STATUS_PILL[status]}`}>
      {status === "Needs Review" ? "Needs review" : status}
    </span>
  );
}

/* Filter chip component */
function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
        active
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className={`ml-1.5 ${active ? "text-slate-300" : "text-slate-400"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

export default function UploadPage() {
  const [stage, setStage] = useState<Stage>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractions, setExtractions] = useState<InvoiceExtraction[]>([]);
  const [currency, setCurrency] = useState<string>("$");
  const [summarySentence, setSummarySentence] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);

  /* Filters */
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [insightsOpen, setInsightsOpen] = useState(false);

  useEffect(() => {
    setHasSavedSession(loadExtraction() !== null);
  }, [stage]);

  /* Clean up object URLs on unmount */
  useEffect(() => {
    return () => {
      pdfUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pdfUrls]);

  /* Filter logic */
  const filteredExtractions = useMemo(() => {
    if (statusFilter === "review") {
      return extractions.filter((ex) => ex.legitimacy.legitimacyStatus === "Needs Review");
    } else if (statusFilter === "high-risk") {
      return extractions.filter((ex) => ex.legitimacy.legitimacyStatus === "High Risk");
    } else if (statusFilter === "ok") {
      return extractions.filter((ex) => ex.legitimacy.legitimacyStatus === "Safe");
    }
    return extractions;
  }, [extractions, statusFilter]);

  /* Counts for filter chips */
  const counts = useMemo(() => ({
    all: extractions.length,
    review: extractions.filter((ex) => ex.legitimacy.legitimacyStatus === "Needs Review").length,
    highRisk: extractions.filter((ex) => ex.legitimacy.legitimacyStatus === "High Risk").length,
    ok: extractions.filter((ex) => ex.legitimacy.legitimacyStatus === "Safe").length,
  }), [extractions]);

  const needsReviewTotal = counts.review + counts.highRisk;

  /* File handling */
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const list = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf");
    setFiles((prev) => [...prev, ...list]);
    setError(null);
  }, []);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...list]);
    e.target.value = "";
    setError(null);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const submit = async () => {
    if (files.length === 0) return;
    const tooBig = files.find((f) => f.size > MAX_FILE_SIZE_BYTES);
    if (tooBig) {
      setError(`"${tooBig.name}" is too large. Max ${MAX_FILE_SIZE_LABEL} per file.`);
      return;
    }
    setError(null);
    setStage("processing");
    try {
      /* Create object URLs for PDF preview */
      const urls = files.map((f) => URL.createObjectURL(f));
      setPdfUrls(urls);

      const { extractions: ex, currency: detectedCurrency, summarySentence: summary } = await extractPdfs(files);
      setExtractions(ex);
      setCurrency(detectedCurrency);
      setSummarySentence(summary);
      saveExtraction(ex, detectedCurrency, summary);
      setSelectedId(ex.length > 0 ? 0 : null);
      setTimeout(() => setStage("results"), 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStage("upload");
    }
  };

  const reset = () => {
    /* Clean up PDF object URLs */
    pdfUrls.forEach((url) => URL.revokeObjectURL(url));
    setPdfUrls([]);

    setStage("upload");
    setFiles([]);
    setExtractions([]);
    setCurrency("$");
    setSummarySentence("");
    setError(null);
    setSelectedId(null);
    setStatusFilter("all");
    setHasSavedSession(loadExtraction() !== null);
  };

  const loadLast = () => {
    const saved = loadExtraction();
    if (!saved) return;
    setExtractions(saved.data);
    setCurrency(saved.currency);
    setSummarySentence(saved.summarySentence ?? "");
    setSelectedId(saved.data.length > 0 ? 0 : null);
    setStage("results");
    setError(null);
  };

  const rows: InvoiceRow[] = extractionsToRows(extractions);
  const totals = extractions.map((e) => parseFloat(String(e.amounts.total).replace(/,/g, "")) || 0);
  const vats = extractions.map((e) => parseFloat(String(e.amounts.vatTaxAmount).replace(/,/g, "")) || 0);
  const grandTotal = totals.reduce((a, b) => a + b, 0);
  const totalVat = vats.reduce((a, b) => a + b, 0);
  const netAmount = grandTotal - totalVat;
  const formatMoney = (n: number) =>
    `${currency}${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  const handleExportExcel = async () => {
    try {
      await downloadExcel(rows, undefined, extractions, currency);
      setError(null);
    } catch {
      setError("Failed to export Excel. Please try again.");
    }
  };

  const handleExportCsv = () => {
    try {
      downloadCsv(rows, undefined, extractions);
      setError(null);
    } catch {
      setError("Failed to export CSV.");
    }
  };

  const isResults = stage === "results" && extractions.length > 0;

  /* Row click handler - find actual index in full extractions array */
  const handleRowClick = (extraction: InvoiceExtraction) => {
    const idx = extractions.indexOf(extraction);
    setSelectedId(idx >= 0 ? idx : null);
  };

  /* Fix extraction: update one field on the selected extraction (for export). */
  const handleFieldChange = useCallback(
    (field: FixableField, value: string) => {
      if (selectedId === null) return;
      setExtractions((prev) => {
        const next = [...prev];
        const ex = { ...next[selectedId] };
        switch (field) {
          case "companyName":
            ex.sender = { ...ex.sender, companyName: value };
            break;
          case "companyRegistrationId":
            ex.sender = { ...ex.sender, companyRegistrationId: value };
            break;
          case "invoiceNumber":
            ex.invoiceDetails = { ...ex.invoiceDetails, invoiceNumber: value };
            break;
          case "invoiceDate":
            ex.invoiceDetails = { ...ex.invoiceDetails, invoiceDate: value };
            break;
          case "dueDate":
            ex.invoiceDetails = { ...ex.invoiceDetails, dueDate: value };
            break;
          case "total":
            ex.amounts = { ...ex.amounts, total: value };
            break;
          case "subtotal":
            ex.amounts = { ...ex.amounts, subtotal: value };
            break;
          case "vatTaxAmount":
            ex.amounts = { ...ex.amounts, vatTaxAmount: value };
            break;
          case "ibanOrAccount":
            ex.payment = { ...ex.payment, ibanOrAccount: value };
            break;
          case "beneficiaryName":
            ex.payment = { ...ex.payment, beneficiaryName: value };
            break;
        }
        next[selectedId] = ex;
        return next;
      });
    },
    [selectedId]
  );

  return (
    <div className="flex flex-1 items-center justify-center">
      {!isResults && (
        <div className="flex-1 bg-slate-50  overflow-auto">
          <div className="max-w-150 max-h-400 mx-auto items-center justify-center">
            {stage === "upload" && (
              <div className="animate-fade-in">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm items-center justify-center">
                  <div className="text-center mb-6 ">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 grid place-items-center mb-3">
                      <svg className="w-6 h-6 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <h1 className="text-xl font-semibold text-slate-900 mb-1">Upload Invoice PDFs</h1>
                    <p className="text-sm text-slate-500">
                      Extract data, review legitimacy, and export to Excel or CSV.
                    </p>
                  </div>

                  <div
                    onDrop={onDrop}
                    onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    className={`relative rounded-xl border-2 border-dashed p-8 text-center transition cursor-pointer ${
                      drag ? "border-slate-400 bg-slate-50" : files.length ? "border-emerald-300 bg-emerald-50/50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <input type="file" accept="application/pdf" multiple onChange={onFileInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    {files.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-900">{files.length} file(s) selected</p>
                        <ul className="text-left text-sm text-slate-600 max-h-32 overflow-y-auto">
                          {files.map((f, i) => (
                            <li key={i} className="flex items-center justify-between gap-2 py-1">
                              <span className="truncate">{f.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400 text-xs">{(f.size / 1024).toFixed(1)} KB</span>
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-rose-600 hover:text-rose-700 text-sm font-medium" aria-label={`Remove ${f.name}`}>×</button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                        <p className="mt-3 text-sm font-semibold text-slate-900">{drag ? "Drop PDFs here" : "Click to select or drag & drop"}</p>
                        <p className="mt-1 text-xs text-slate-500">PDF only, max {MAX_FILE_SIZE_LABEL} per file</p>
                      </>
                    )}
                  </div>

                  {error && <div className="mt-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3" role="alert">{error}</div>}

                  <div className="mt-5 flex flex-col gap-3">
                    <button onClick={submit} disabled={files.length === 0} className="w-full rounded-xl bg-slate-900 text-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition">
                      Extract data
                    </button>
                    {hasSavedSession && (
                      <button type="button" onClick={loadLast} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                        Load last extraction
                      </button>
                    )}
                  </div>

                  <p className="mt-4 text-xs text-slate-500 text-center">
                    Files are processed for extraction only. We do not store your data.
                  </p>
                </div>
              </div>
            )}

            {stage === "processing" && (
              <div className="animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-slate-200 border-t-slate-500 animate-spin" />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-slate-900">Processing…</h2>
                <p className="mt-1 text-sm text-slate-500">Extracting data from your PDF(s)</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESULTS STAGE - Master/Detail Layout */}
      {isResults && (
        <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px]">
          {/* LEFT: Table + PDF */}
          <div className="min-w-0 min-h-0 flex flex-col bg-slate-50">
            {/* Page header */}
            <header className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-base sm:text-lg font-semibold text-slate-900">Invoices</h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {extractions.length} invoice{extractions.length !== 1 ? "s" : ""} extracted
                    {needsReviewTotal > 0 && (
                      <span className="text-amber-600 ml-1">· {needsReviewTotal} need{needsReviewTotal === 1 ? "s" : ""} review</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={reset} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                    Upload more
                  </button>
                  <button onClick={handleExportCsv} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                    Export CSV
                  </button>
                  <button onClick={handleExportExcel} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs sm:text-sm font-medium text-white hover:bg-emerald-700 transition">
                    Export Excel
                  </button>
                </div>
              </div>
            </header>

            {/* Filters row - status chips only */}
            <div className="shrink-0 px-4 sm:px-6 py-3 bg-white border-b border-slate-200 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 min-w-max sm:min-w-0">
                <FilterChip label="All" count={counts.all} active={statusFilter === "all"} onClick={() => setStatusFilter("all")} />
                <FilterChip label="Needs review" count={counts.review} active={statusFilter === "review"} onClick={() => setStatusFilter("review")} />
                <FilterChip label="High risk" count={counts.highRisk} active={statusFilter === "high-risk"} onClick={() => setStatusFilter("high-risk")} />
                <FilterChip label="OK" count={counts.ok} active={statusFilter === "ok"} onClick={() => setStatusFilter("ok")} />
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 min-h-0 overflow-auto scrollbar-hide p-4 sm:p-6">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto scrollbar-hide">
                {filteredExtractions.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center">
                    <p className="text-sm text-slate-500">No invoices match your filters.</p>
                    <button type="button" onClick={() => setStatusFilter("all")} className="mt-2 text-sm text-slate-900 font-medium underline hover:no-underline">
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Vendor</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Invoice #</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Date</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Total</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">VAT</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExtractions.map((inv) => {
                        const idx = extractions.indexOf(inv);
                        const isSelected = selectedId === idx;
                        return (
                          <tr
                            key={idx}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleRowClick(inv)}
                            onKeyDown={(e) => e.key === "Enter" && handleRowClick(inv)}
                            className={`border-b border-slate-100 last:border-0 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-300 ${
                              isSelected ? "bg-slate-100" : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="px-3 sm:px-4 py-2 sm:py-3 font-medium text-slate-900 max-w-[120px] sm:max-w-none truncate" title={inv.sender.companyName}>{inv.sender.companyName}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-slate-600 whitespace-nowrap">{inv.invoiceDetails.invoiceNumber}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-slate-600 whitespace-nowrap">{inv.invoiceDetails.invoiceDate}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-slate-900 text-right tabular-nums whitespace-nowrap">{inv.amounts.total} {inv.amounts.currency}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-slate-600 text-right tabular-nums whitespace-nowrap">{inv.amounts.vatTaxAmount}</td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3">
                              <StatusBadge status={inv.legitimacy.legitimacyStatus} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Insights collapsible */}
              {extractions.length > 1 && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setInsightsOpen((o) => !o)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition"
                  >
                    <span className="text-sm font-medium text-slate-900">Insights</span>
                    <svg className={`w-4 h-4 text-slate-400 transition ${insightsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {insightsOpen && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Grand total</p>
                          <p className="text-base sm:text-lg font-semibold text-slate-900 mt-1">{formatMoney(grandTotal)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total VAT</p>
                          <p className="text-base sm:text-lg font-semibold text-slate-900 mt-1">{formatMoney(totalVat)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Net amount</p>
                          <p className="text-base sm:text-lg font-semibold text-emerald-600 mt-1">{formatMoney(netAmount)}</p>
                        </div>
                      </div>
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 min-h-[200px]">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Net vs VAT</p>
                        <PieChart
                          series={[
                            {
                              data: [
                                { id: 0, value: netAmount, label: "Net", color: "#10b981" },
                                { id: 1, value: totalVat, label: "VAT", color: "#f43f5e" },
                              ],
                              highlightScope: { fade: "global", highlight: "item" },
                              innerRadius: 36,
                              paddingAngle: 2,
                              cornerRadius: 4,
                            },
                          ]}
                          height={180}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PDF Preview - centered under the table */}
              {pdfUrls.length > 0 && (
                <div className="mt-6 sm:mt-8 flex flex-col items-center w-full">
                  <div className="w-full max-w-4xl">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      <iframe
                        src={pdfUrls[selectedId !== null ? selectedId : 0]}
                        className="w-full h-[min(70vh,500px)] sm:h-[500px] md:h-[600px] lg:h-[700px]"
                        title="Invoice PDF preview"
                      />
                    </div>
                    <div className="mt-4 sm:mt-6 flex justify-center">
                      <button
                        onClick={reset}
                        className="rounded-xl bg-slate-900 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white hover:bg-slate-800 transition w-full sm:w-auto"
                      >
                        Upload more invoices
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Detail panel */}
          <div className="min-h-0 border-l border-slate-200 bg-white hidden xl:flex flex-col overflow-auto scrollbar-hide">
            {selectedId !== null && extractions[selectedId] ? (
              <InvoiceDetailPanel
                extraction={extractions[selectedId]}
                currency={currency}
                onClose={() => setSelectedId(null)}
                onFieldChange={handleFieldChange}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 grid place-items-center mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">Click a row to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile/Tablet: Full-screen detail overlay */}
      {isResults && selectedId !== null && extractions[selectedId] && (
        <div className="xl:hidden fixed inset-0 z-50 bg-white overflow-auto scrollbar-hide">
          <InvoiceDetailPanel
            extraction={extractions[selectedId]}
            currency={currency}
            onClose={() => setSelectedId(null)}
            showCloseButton
            onFieldChange={handleFieldChange}
          />
        </div>
      )}
    </div>
  );
}
