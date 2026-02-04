"use client";

import React, { useState, useCallback, useEffect } from "react";
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
import ResultsSidenav, { type SidebarSectionId } from "@/components/results-sidenav";

type Stage = "upload" | "processing" | "results";

/* Design tokens: status pills (Safe / Needs review / High risk) */
const STATUS_PILL: Record<LegitimacyStatus, string> = {
  Safe: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Needs Review": "bg-amber-50 text-amber-700 border border-amber-200",
  "High Risk": "bg-rose-50 text-rose-700 border border-rose-200",
};

function StatusBadge({ status }: { status: LegitimacyStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${STATUS_PILL[status]}`}>
      {status === "Needs Review" ? "Needs review" : status}
    </span>
  );
}

/* Base card wrapper */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

/* Label / value row */
function Row({
  label,
  value,
  missing,
  warning,
}: {
  label: string;
  value: React.ReactNode;
  missing?: boolean;
  warning?: boolean;
}) {
  const display = missing ? "—" : value;
  const valueClass = missing ? (warning ? "text-amber-600" : "text-slate-400") : (warning ? "text-amber-600" : "font-semibold text-slate-900");
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0">
      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide shrink-0">{label}</dt>
      <dd className={`text-sm text-right min-w-0 ${valueClass}`}>
        {display}
      </dd>
    </div>
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [activeSection, setActiveSection] = useState<SidebarSectionId>("dashboard");

  useEffect(() => {
    setHasSavedSession(loadExtraction() !== null);
  }, [stage]);

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
      const { extractions: ex, currency: detectedCurrency, summarySentence: summary } = await extractPdfs(files);
      setExtractions(ex);
      setCurrency(detectedCurrency);
      setSummarySentence(summary);
      saveExtraction(ex, detectedCurrency, summary);
      setSelectedIndex(0);
      setTimeout(() => setStage("results"), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStage("upload");
    }
  };

  const reset = () => {
    setStage("upload");
    setFiles([]);
    setExtractions([]);
    setCurrency("$");
    setSummarySentence("");
    setError(null);
    setHasSavedSession(loadExtraction() !== null);
  };

  const loadLast = () => {
    const saved = loadExtraction();
    if (!saved) return;
    setExtractions(saved.data);
    setCurrency(saved.currency);
    setSummarySentence(saved.summarySentence ?? "");
    setSelectedIndex(0);
    setStage("results");
    setError(null);
  };

  const rows: InvoiceRow[] = extractionsToRows(extractions);
  const totals = extractions.map((e) => parseFloat(String(e.amounts.total).replace(/,/g, "")) || 0);
  const vats = extractions.map((e) => parseFloat(String(e.amounts.vatTaxAmount).replace(/,/g, "")) || 0);
  const grandTotal = totals.reduce((a, b) => a + b, 0);
  const totalVat = vats.reduce((a, b) => a + b, 0);
  const netAmount = grandTotal - totalVat;
  const taxSharePct = grandTotal > 0 ? (totalVat / grandTotal) * 100 : 0;
  const formatMoney = (n: number) =>
    `${currency}${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  const needsReview = extractions.some(
    (e) => e.legitimacy.legitimacyStatus === "Needs Review" || e.legitimacy.legitimacyStatus === "High Risk"
  );

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

  const ex = extractions[selectedIndex];

  const isResults = stage === "results" && extractions.length > 0;

  return (
    <div className={isResults ? "flex flex-1 min-h-0" : "min-h-screen bg-slate-50 p-6"}>
      {!isResults && (
      <div className="max-w-6xl mx-auto space-y-6">
      {/* ----- UPLOAD STAGE ----- */}
      {stage === "upload" && (
        <div className="animate-fade-in">
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm max-w-xl mx-auto">
            <div className="text-center mb-5">
              <div className="mx-auto w-12 h-12 rounded-xl border border-slate-200/60 bg-slate-50 grid place-items-center mb-3">
                <svg className="w-6 h-6 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-slate-900 mb-1">Upload Invoice PDFs</h1>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Upload one or more invoice PDFs. We extract sender, amounts, payment details, and legitimacy. Export to Excel or CSV.
              </p>
            </div>
            <div className="space-y-2 mb-5">
              <div className="flex items-start gap-3 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full border border-slate-200/60 bg-slate-50 text-slate-600 grid place-items-center text-xs font-medium">1</span>
                <div>
                  <p className="font-semibold text-slate-900">Upload</p>
                  <p className="text-slate-500 text-sm">Select or drag PDFs (max {MAX_FILE_SIZE_LABEL} each)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full border border-slate-200/60 bg-slate-50 text-slate-600 grid place-items-center text-xs font-medium">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Extract</p>
                  <p className="text-slate-500 text-sm">We extract sender, invoice details, amounts, payment, and legitimacy scores</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full border border-slate-200/60 bg-slate-50 text-slate-600 grid place-items-center text-xs font-medium">3</span>
                <div>
                  <p className="font-semibold text-slate-900">Review & export</p>
                  <p className="text-slate-500 text-sm">Review and export to Excel or CSV</p>
                </div>
              </div>
            </div>
            <div
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer border-slate-200/60 bg-slate-50 ${drag ? "border-slate-300" : files.length ? "border-emerald-300 bg-emerald-50/50" : "hover:border-slate-300"}`}
            >
              <input type="file" accept="application/pdf" multiple onChange={onFileInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {files.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">{files.length} file(s) selected</p>
                  <ul className="text-left text-sm text-slate-600 max-h-28 overflow-y-auto">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between gap-2">
                        <span className="truncate">{f.name}</span>
                        <span className="text-slate-400 text-xs">{(f.size / 1024).toFixed(1)} KB</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="shrink-0 text-rose-600 hover:text-rose-700 text-sm" aria-label={`Remove ${f.name}`}>×</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <svg className="mx-auto h-9 w-9 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{drag ? "Drop PDFs here" : "Click to select or drag & drop"}</p>
                  <p className="mt-0.5 text-xs text-slate-500">PDF only, max {MAX_FILE_SIZE_LABEL} per file</p>
                </>
              )}
            </div>
            <p className="mt-4 text-xs text-slate-500 rounded-xl border border-slate-200/60 bg-slate-50 p-3">
              Your files are processed in the browser for extraction only. We do not store your PDFs or invoice data after you leave.
            </p>
            {error && <div className="mt-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3" role="alert">{error}</div>}
            <div className="mt-5 flex flex-col gap-3">
              <button onClick={submit} disabled={files.length === 0} className="w-full rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0">Extract data</button>
              {hasSavedSession && (
                <button type="button" onClick={loadLast} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Load last extraction</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----- PROCESSING ----- */}
      {stage === "processing" && (
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-slate-200/60 border-t-slate-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-7 h-7 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.5 6L20 10l-6.5 2L12 18l-1.5-6L4 10l6.5-2L12 2z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-900">Processing…</h2>
          <p className="mt-1 text-sm text-slate-500">Extracting data from your PDF(s)</p>
        </div>
      )}

      </div>
      )}

      {isResults && (
        <>
          <ResultsSidenav activeSection={activeSection} onSectionChange={setActiveSection} />
          <div className={`flex-1 overflow-auto min-w-0 bg-slate-50 p-6 ${activeSection !== "dashboard" ? "flex items-center justify-center" : ""}`}>
            <div className={`mx-auto animate-fade-in ${activeSection === "dashboard" ? "max-w-6xl space-y-6" : "w-full max-w-2xl"}`}>
          {/* Dashboard: header + summary */}
          <section id="dashboard" className={activeSection !== "dashboard" ? "hidden" : ""}>
          <header className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Extraction complete</h1>
              <p className="text-sm text-slate-500 mt-0.5">{extractions.length} invoice(s) — review below and export.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={reset} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Upload more</button>
              <button onClick={handleExportExcel} className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700">Export Excel</button>
              <button onClick={handleExportCsv} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Export CSV</button>
            </div>
          </header>

          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-700 leading-relaxed">
              {ex ? (() => {
                const status = ex.legitimacy.legitimacyStatus;
                const statusClass = status === "Safe" ? "text-emerald-700 font-semibold" : status === "Needs Review" ? "text-amber-700 font-semibold" : "text-rose-700 font-semibold";
                const parts = summarySentence.split(/\b(Safe|Needs Review|High Risk)\b/);
                if (parts.length > 1) {
                  return (
                    <>
                      {parts.map((seg, i) =>
                        /^(Safe|Needs Review|High Risk)$/.test(seg) ? (
                          <span key={i} className={statusClass}>
                            {seg === "Needs Review" ? "Needs review" : seg}
                          </span>
                        ) : (
                          <span key={i}>{seg}</span>
                        )
                      )}
                    </>
                  );
                }
                return (
                  <>
                    {summarySentence}{" "}
                    <span className={statusClass}>({status === "Needs Review" ? "Needs review" : status})</span>
                  </>
                );
              })() : summarySentence}
            </p>
          </div>

          {extractions.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {extractions.map((e, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${selectedIndex === i ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                >
                  {e.filename}
                </button>
              ))}
            </div>
          )}
          </section>

          {ex && (
            <>
              <div className={`grid gap-5 ${activeSection === "dashboard" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"}`}>
                <section id="sender-identity" className={activeSection !== "dashboard" && activeSection !== "sender-identity" ? "hidden" : ""}>
                <Card>
                  <h2 className="text-sm font-semibold text-slate-900 mb-3">Sender Identity</h2>
                  <dl className="space-y-0">
                    <Row label="Company" value={ex.sender.companyName} missing={ex.sender.companyName === "Unknown"} />
                    <Row label="CVR / VAT" value={ex.sender.companyRegistrationId} missing={ex.sender.companyRegistrationId === "—"} />
                    <Row label="Address" value={ex.sender.address} missing={ex.sender.address === "—"} />
                    <Row label="Country" value={ex.sender.country} missing={ex.sender.country === "—"} />
                    {ex.sender.companyLogoUrl && (
                      <div className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-100">
                        <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Logo</dt>
                        <dd><img src={ex.sender.companyLogoUrl} alt="Company logo" className="h-10 object-contain" /></dd>
                      </div>
                    )}
                  </dl>
                </Card>
                </section>

                <section id="invoice-details" className={activeSection !== "dashboard" && activeSection !== "invoice-details" ? "hidden" : ""}>
                <Card>
                  <h2 className="text-sm font-semibold text-slate-900 mb-3">Invoice Details</h2>
                  <dl className="space-y-0">
                    <Row label="Invoice #" value={ex.invoiceDetails.invoiceNumber} missing={ex.invoiceDetails.invoiceNumber === "—"} warning={ex.invoiceDetails.invoiceNumber === "—"} />
                    <Row label="Date" value={ex.invoiceDetails.invoiceDate} missing={ex.invoiceDetails.invoiceDate === "—"} />
                    <Row label="Due date" value={ex.invoiceDetails.dueDate} missing={ex.invoiceDetails.dueDate === "—"} />
                    <Row label="Payment terms" value={ex.invoiceDetails.paymentTerms} missing={ex.invoiceDetails.paymentTerms === "—"} />
                  </dl>
                </Card>
                </section>

                <section id="amounts" className={activeSection !== "dashboard" && activeSection !== "amounts" ? "hidden" : ""}>
                <Card>
                  <h2 className="text-sm font-semibold text-slate-900 mb-3">Amounts</h2>
                  <dl className="space-y-0">
                    <Row label="Subtotal" value={`${ex.amounts.subtotal} ${ex.amounts.currency}`} missing={ex.amounts.subtotal === "—"} />
                    <Row label="VAT / Tax" value={ex.amounts.vatTaxAmount + (ex.amounts.vatTaxRate !== "—" ? ` (${ex.amounts.vatTaxRate})` : "")} missing={ex.amounts.vatTaxAmount === "—"} />
                    <Row label="Total due" value={`${ex.amounts.total} ${ex.amounts.currency}`} missing={ex.amounts.total === "—"} />
                    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0">
                      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide shrink-0">Math check</dt>
                      <dd className="text-sm text-right min-w-0">
                        {ex.amounts.mathValid ? (
                          <span className="text-emerald-600 font-medium">Totals consistent</span>
                        ) : (
                          <span className="text-amber-600 font-medium">Total does not match Subtotal + Tax.</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </Card>
                </section>
              </div>

              <div className={`grid gap-5 ${activeSection === "dashboard" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                <section id="payment" className={activeSection !== "dashboard" && activeSection !== "payment" ? "hidden" : ""}>
                <Card>
                  <h2 className="text-sm font-semibold text-slate-900 mb-3">Payment</h2>
                  <dl className="space-y-0">
                    <Row label="Method" value={ex.payment.paymentMethod} missing={ex.payment.paymentMethod === "—"} />
                    <Row label="Beneficiary" value={ex.payment.beneficiaryName} missing={ex.payment.beneficiaryName === "—"} />
                    <Row label="IBAN / account" value={ex.payment.ibanOrAccount} missing={ex.payment.ibanOrAccount === "—"} />
                    <Row label="Bank country" value={ex.payment.bankCountry} missing={ex.payment.bankCountry === "—"} />
                    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0">
                      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide shrink-0">Match sender</dt>
                      <dd className="text-sm text-right min-w-0">
                        {ex.payment.consistentWithSender ? (
                          <span className="text-emerald-600 font-medium">Yes</span>
                        ) : (
                          <span className="text-amber-600 font-medium">Verify</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </Card>
                </section>

                <section id="legitimacy" className={activeSection !== "dashboard" && activeSection !== "legitimacy" ? "hidden" : ""}>
                <Card>
                  <h2 className="text-sm font-semibold text-slate-900 mb-3">Legitimacy</h2>
                  <div className="flex flex-wrap gap-4 mb-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Legitimacy</p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">{ex.legitimacy.legitimacyScore}%</p>
                      <StatusBadge status={ex.legitimacy.legitimacyStatus} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Data quality</p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">{ex.legitimacy.dataQualityScore}%</p>
                    </div>
                  </div>
                  {ex.legitimacy.issues.length > 0 && (
                    <div className="pt-3 border-t border-slate-200/60">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Issues (top 3)</p>
                      <ul className="space-y-1">
                        {ex.legitimacy.issues.slice(0, 3).map((issue, i) => {
                          const isCritical = /missing|don't add up|mismatch|high risk/i.test(issue);
                          const isReview = /review|unusually|quality/i.test(issue) && !isCritical;
                          const issueClass = isCritical ? "text-rose-600" : isReview ? "text-amber-600" : "text-slate-600";
                          return (
                            <li key={i} className={`text-sm ${issueClass}`}>
                              • {issue}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </Card>
                </section>
              </div>
            </>
          )}

          <section id="statistics" className={activeSection !== "dashboard" && activeSection !== "statistics" ? "hidden" : ""}>
          <div className={`grid gap-5 ${activeSection === "dashboard" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1"}`}>
            <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Grand total</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{formatMoney(grandTotal)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total VAT / Tax share</p>
              <p className="text-sm font-semibold text-rose-600 mt-1">{formatMoney(totalVat)} <span className="text-slate-500 font-normal">({taxSharePct.toFixed(0)}%)</span></p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Net amount</p>
              {ex && !ex.amounts.mathValid && grandTotal > 0 ? (
                <>
                  <p className="text-sm font-semibold text-slate-400 mt-1">Net unavailable</p>
                  <p className="text-xs text-amber-600 mt-0.5">Totals don't add up</p>
                </>
              ) : (
                <p className="text-sm font-semibold text-emerald-600 mt-1">{formatMoney(netAmount)}</p>
              )}
            </div>
          </div>
          </section>

          {extractions.length > 0 && (
            <section id="chart" className={activeSection !== "dashboard" && activeSection !== "chart" ? "hidden" : ""}>
            <Card>
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Net vs VAT</h2>
              <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-4">
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
                  height={220}
                />
              </div>
            </Card>
            </section>
          )}

          <section id="extracted-data" className={activeSection !== "dashboard" && activeSection !== "extracted-data" ? "hidden" : ""}>
          <div className="rounded-2xl border border-slate-200/60 bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-200/60">
              <h2 className="text-sm font-semibold text-slate-900">Extracted Data</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/60 bg-slate-50">
                    <th className="px-5 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">#</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Vendor</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Date</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Total</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">VAT</th>
                    <th className="px-5 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {extractions.map((inv, i) => (
                    <tr key={i} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                      <td className="px-5 py-2.5 text-slate-500">{i + 1}</td>
                      <td className="px-5 py-2.5 font-semibold text-slate-900">{inv.sender.companyName}</td>
                      <td className="px-5 py-2.5 text-slate-700">{inv.invoiceDetails.invoiceDate}</td>
                      <td className="px-5 py-2.5 text-slate-700 tabular-nums">{inv.amounts.total} {inv.amounts.currency}</td>
                      <td className="px-5 py-2.5 text-slate-700 tabular-nums">{inv.amounts.vatTaxAmount}</td>
                      <td className="px-5 py-2.5">
                        <StatusBadge status={inv.legitimacy.legitimacyStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </section>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
              {error}
            </div>
          )}
            </div>
          </div>
        </>
      )}

      </div>
  );
}
