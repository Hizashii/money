"use client";

import React, { useState } from "react";
import type { InvoiceExtraction } from "@/lib/extract";
import type { LegitimacyStatus } from "@/lib/extract";

/* Status pill styling */
const STATUS_PILL: Record<LegitimacyStatus, string> = {
  Safe: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Needs Review": "bg-amber-50 text-amber-700 border-amber-200",
  "High Risk": "bg-rose-50 text-rose-700 border-rose-200",
};

function StatusBadge({ status, size = "sm" }: { status: LegitimacyStatus; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${sizeClass} ${STATUS_PILL[status]}`}>
      {status === "Needs Review" ? "Needs review" : status}
    </span>
  );
}


type TabId = "overview" | "details" | "payment" | "legitimacy" | "statistics";

interface InvoiceDetailPanelProps {
  extraction: InvoiceExtraction;
  currency: string;
  onClose: () => void;
  showCloseButton?: boolean; // Only show X on mobile overlay
}

export default function InvoiceDetailPanel({ extraction: ex, currency, onClose, showCloseButton = false }: InvoiceDetailPanelProps) {
  const [tab, setTab] = useState<TabId>("overview");

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "details", label: "Details" },
    { id: "payment", label: "Payment" },
    { id: "legitimacy", label: "Legitimacy" },
    { id: "statistics", label: "Statistics" },
  ];

  /* Calculate statistics */
  const totalNum = parseFloat(String(ex.amounts.total).replace(/,/g, "")) || 0;
  const vatNum = parseFloat(String(ex.amounts.vatTaxAmount).replace(/,/g, "")) || 0;
  const subtotalNum = parseFloat(String(ex.amounts.subtotal).replace(/,/g, "")) || 0;
  const netAmount = totalNum - vatNum;
  const vatPct = totalNum > 0 ? (vatNum / totalNum) * 100 : 0;
  const netPct = totalNum > 0 ? (netAmount / totalNum) * 100 : 0;

  const totalDisplay = ex.amounts.total !== "—" ? `${ex.amounts.currency}${ex.amounts.total}` : "—";

  return (
    <aside className="w-full h-full flex flex-col bg-white min-h-0">
      {/* Panel header */}
      <div className="shrink-0 px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-200">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 text-base sm:text-lg">Statistics</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">{totalDisplay}</span>
              <StatusBadge status={ex.legitimacy.legitimacyStatus} />
            </div>
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-2 italic">Demo only — results may not be 100% accurate</p>
      </div>

      {/* Tabs */}
      <div className="shrink-0 border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-hide">
        <nav className="flex gap-1 -mb-px px-3 sm:px-4 min-w-max" aria-label="Tabs">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`px-2.5 sm:px-3 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                tab === id
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto scrollbar-hide p-4 sm:p-5">
        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="space-y-5">
            {/* Summary sentence */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-sm text-slate-700 leading-relaxed">{ex.summarySentence}</p>
            </div>

            {/* Legitimacy + Data quality scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Legitimacy</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{ex.legitimacy.legitimacyScore}%</p>
                <StatusBadge status={ex.legitimacy.legitimacyStatus} size="lg" />
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Data quality</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{ex.legitimacy.dataQualityScore}%</p>
                <p className="text-xs text-slate-500 mt-1">Fields extracted</p>
              </div>
            </div>

            {/* Top issues (max 3) */}
            {ex.legitimacy.issues.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Top issues</p>
                <ul className="space-y-2">
                  {ex.legitimacy.issues.slice(0, 3).map((issue, i) => {
                    const isCritical = /math|total|add.*up|iban|beneficiary|payment/i.test(issue);
                    return (
                      <li key={i} className={`text-sm ${isCritical ? "text-rose-600" : "text-amber-600"}`}>
                        <span className="font-medium">·</span> {issue}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Amounts block */}
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Amounts</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Subtotal</dt>
                  <dd className="font-medium text-slate-900">{ex.amounts.subtotal} {ex.amounts.currency}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">VAT / Tax</dt>
                  <dd className="text-slate-900">
                    {ex.amounts.vatTaxAmount}
                    {ex.amounts.vatTaxRate !== "—" && <span className="text-slate-500 ml-1">({ex.amounts.vatTaxRate})</span>}
                  </dd>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <dt className="text-slate-500 font-medium">Total due</dt>
                  <dd className="font-semibold text-slate-900">{ex.amounts.total} {ex.amounts.currency}</dd>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <dt className="text-slate-500">Math check</dt>
                  <dd>
                    {ex.amounts.mathValid ? (
                      <span className="text-emerald-600 font-medium">✓ Consistent</span>
                    ) : (
                      <span className="text-amber-600 font-medium">Totals don&apos;t match</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* DETAILS TAB */}
        {tab === "details" && (
          <div className="space-y-5">
            {/* Sender identity */}
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Sender identity</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Company</dt>
                  <dd className="font-medium text-slate-900 text-right">{ex.sender.companyName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">VAT / Reg. ID</dt>
                  <dd className={`text-right ${ex.sender.companyRegistrationId === "—" ? "text-amber-500" : "font-medium text-slate-900"}`}>
                    {ex.sender.companyRegistrationId}
                    {ex.sender.companyRegistrationId === "—" && <span className="ml-1 text-xs">(missing)</span>}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Address</dt>
                  <dd className={`text-right ${ex.sender.address === "—" ? "text-slate-400" : "text-slate-900"}`}>
                    {ex.sender.address}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Country</dt>
                  <dd className={`text-right ${ex.sender.country === "—" ? "text-slate-400" : "text-slate-900"}`}>
                    {ex.sender.country}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Contact info */}
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Contact information</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Email</dt>
                  <dd className={`text-right ${ex.sender.email === "—" ? "text-slate-400" : "text-slate-900"}`}>
                    {ex.sender.email !== "—" ? (
                      <a href={`mailto:${ex.sender.email}`} className="text-blue-600 hover:underline">{ex.sender.email}</a>
                    ) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Phone</dt>
                  <dd className={`text-right ${ex.sender.phone === "—" ? "text-slate-400" : "text-slate-900"}`}>
                    {ex.sender.phone}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Website</dt>
                  <dd className={`text-right ${ex.sender.website === "—" ? "text-slate-400" : "text-slate-900"}`}>
                    {ex.sender.website !== "—" ? (
                      <a href={ex.sender.website.startsWith("http") ? ex.sender.website : `https://${ex.sender.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{ex.sender.website}</a>
                    ) : "—"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Invoice details */}
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Invoice details</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Invoice #</dt>
                  <dd className={`text-right ${ex.invoiceDetails.invoiceNumber === "—" ? "text-amber-500" : "font-medium text-slate-900"}`}>
                    {ex.invoiceDetails.invoiceNumber}
                    {ex.invoiceDetails.invoiceNumber === "—" && <span className="ml-1 text-xs">(missing)</span>}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Invoice date</dt>
                  <dd className={`text-right ${ex.invoiceDetails.invoiceDate === "—" ? "text-amber-500" : "text-slate-900"}`}>
                    {ex.invoiceDetails.invoiceDate}
                    {ex.invoiceDetails.invoiceDate === "—" && <span className="ml-1 text-xs">(missing)</span>}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Due date</dt>
                  <dd className={`text-right ${ex.invoiceDetails.dueDate === "—" ? "text-slate-400" : "text-slate-900"}`}>
                    {ex.invoiceDetails.dueDate}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Payment terms</dt>
                  <dd className={`text-right ${ex.invoiceDetails.paymentTerms === "—" ? "text-slate-400" : "text-slate-900"}`}>
                    {ex.invoiceDetails.paymentTerms}
                  </dd>
                </div>
                {ex.invoiceDetails.purchaseOrder !== "—" && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 shrink-0">PO #</dt>
                    <dd className="text-slate-900 text-right">{ex.invoiceDetails.purchaseOrder}</dd>
                  </div>
                )}
                {ex.invoiceDetails.customerRef !== "—" && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 shrink-0">Customer ref</dt>
                    <dd className="text-slate-900 text-right">{ex.invoiceDetails.customerRef}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}

        {/* PAYMENT TAB */}
        {tab === "payment" && (
          <div className="space-y-5">
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Payment destination</p>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-slate-500 text-xs uppercase tracking-wide">Method</dt>
                  <dd className={`mt-0.5 ${ex.payment.paymentMethod === "Not specified" ? "text-slate-400" : "font-medium text-slate-900"}`}>
                    {ex.payment.paymentMethod}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 text-xs uppercase tracking-wide">Beneficiary</dt>
                  <dd className={`mt-0.5 ${ex.payment.beneficiaryName === "—" ? "text-slate-400" : "font-medium text-slate-900"}`}>
                    {ex.payment.beneficiaryName}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 text-xs uppercase tracking-wide">IBAN / Account</dt>
                  <dd className="mt-0.5">
                    <span className={`font-mono text-xs ${ex.payment.ibanOrAccount === "—" ? "text-slate-400" : "text-slate-900"}`}>
                      {ex.payment.ibanOrAccount}
                    </span>
                    {ex.payment.ibanOrAccount !== "—" && ex.payment.ibanOrAccount.length >= 15 && (
                      <span className={`ml-2 text-xs font-medium ${ex.payment.ibanValid ? "text-emerald-600" : "text-rose-600"}`}>
                        {ex.payment.ibanValid ? "✓ Valid" : "⚠ Invalid checksum"}
                      </span>
                    )}
                  </dd>
                </div>
                {ex.payment.swiftBic !== "—" && (
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide">SWIFT / BIC</dt>
                    <dd className="mt-0.5 font-mono text-xs text-slate-900">{ex.payment.swiftBic}</dd>
                  </div>
                )}
                {ex.payment.bankName !== "—" && (
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide">Bank</dt>
                    <dd className="mt-0.5 text-slate-900">{ex.payment.bankName}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-slate-500 text-xs uppercase tracking-wide">Bank country</dt>
                  <dd className={`mt-0.5 ${ex.payment.bankCountry === "—" ? "text-slate-400" : "text-slate-900"}`}>
                    {ex.payment.bankCountry}
                  </dd>
                </div>
                {ex.payment.routingNumber !== "—" && (
                  <div>
                    <dt className="text-slate-500 text-xs uppercase tracking-wide">Routing / Sort code</dt>
                    <dd className="mt-0.5 font-mono text-xs text-slate-900">{ex.payment.routingNumber}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Matches sender indicator */}
            <div className={`rounded-xl border p-4 ${ex.payment.consistentWithSender ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
              <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${ex.payment.consistentWithSender ? "text-emerald-700" : "text-rose-700"}`}>
                Beneficiary verification
              </p>
              {ex.payment.consistentWithSender ? (
                <p className="text-sm text-emerald-700 font-medium">✓ Beneficiary matches sender identity</p>
              ) : (
                <div>
                  <p className="text-sm text-amber-700 font-medium">Verify — beneficiary does not clearly match sender</p>
                  {ex.payment.consistencyNote && ex.payment.consistencyNote !== "—" && (
                    <p className="text-xs text-amber-600 mt-1">{ex.payment.consistencyNote}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* LEGITIMACY TAB */}
        {tab === "legitimacy" && (
          <div className="space-y-5">
            {/* Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Legitimacy score</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{ex.legitimacy.legitimacyScore}%</p>
                <StatusBadge status={ex.legitimacy.legitimacyStatus} size="lg" />
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Data quality</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{ex.legitimacy.dataQualityScore}%</p>
                <p className="text-xs text-slate-500 mt-1">{ex.legitimacy.fieldsFound}/{ex.legitimacy.fieldsTotal} fields</p>
              </div>
            </div>

            {/* Issues */}
            {ex.legitimacy.issues.length > 0 && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
                <p className="text-xs font-medium text-rose-700 uppercase tracking-wide mb-2">Issues ({ex.legitimacy.issues.length})</p>
                <ul className="space-y-1.5">
                  {ex.legitimacy.issues.map((issue, i) => (
                    <li key={i} className="text-sm text-rose-700">
                      <span className="font-medium">✗</span> {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {ex.legitimacy.warnings && ex.legitimacy.warnings.length > 0 && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-2">Warnings ({ex.legitimacy.warnings.length})</p>
                <ul className="space-y-1.5">
                  {ex.legitimacy.warnings.map((warning, i) => (
                    <li key={i} className="text-sm text-amber-700">
                      <span className="font-medium">⚠</span> {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* All clear */}
            {ex.legitimacy.issues.length === 0 && (!ex.legitimacy.warnings || ex.legitimacy.warnings.length === 0) && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                <p className="text-sm text-emerald-700 font-medium">✓ No issues or warnings detected</p>
              </div>
            )}

            {/* Extraction summary */}
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Extraction summary</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fields extracted</span>
                  <span className="font-medium text-slate-900">{ex.legitimacy.fieldsFound} / {ex.legitimacy.fieldsTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issues found</span>
                  <span className={`font-medium ${ex.legitimacy.issues.length > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                    {ex.legitimacy.issues.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Warnings</span>
                  <span className={`font-medium ${ex.legitimacy.warnings && ex.legitimacy.warnings.length > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                    {ex.legitimacy.warnings ? ex.legitimacy.warnings.length : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATISTICS TAB */}
        {tab === "statistics" && (
          <div className="space-y-5">
            {/* Amount breakdown */}
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">Amount breakdown</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Net amount</span>
                  <span className="text-lg font-semibold text-emerald-600">
                    {ex.amounts.currency}{netAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">VAT / Tax</span>
                  <span className="text-lg font-semibold text-rose-600">
                    {ex.amounts.currency}{vatNum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-sm font-medium text-slate-900">Total</span>
                  <span className="text-lg font-bold text-slate-900">
                    {ex.amounts.currency}{totalNum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual breakdown bar */}
            {totalNum > 0 && (
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Net vs VAT</p>
                <div className="h-8 rounded-lg overflow-hidden flex">
                  <div
                    className="bg-emerald-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${netPct}%` }}
                  >
                    {netPct > 15 && `${netPct.toFixed(0)}%`}
                  </div>
                  <div
                    className="bg-rose-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${vatPct}%` }}
                  >
                    {vatPct > 10 && `${vatPct.toFixed(0)}%`}
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Net ({netPct.toFixed(1)}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    VAT ({vatPct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}

            {/* Tax rate info */}
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Tax information</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">VAT rate</dt>
                  <dd className="font-medium text-slate-900">
                    {ex.amounts.vatTaxRate !== "—" ? ex.amounts.vatTaxRate : `${vatPct.toFixed(1)}% (calculated)`}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">VAT amount</dt>
                  <dd className="font-medium text-slate-900">{ex.amounts.vatTaxAmount} {ex.amounts.currency}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Subtotal</dt>
                  <dd className="font-medium text-slate-900">
                    {subtotalNum > 0 ? `${subtotalNum.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${ex.amounts.currency}` : "—"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Math validation */}
            <div className={`rounded-xl border p-4 ${ex.amounts.mathValid ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
              <p className="text-xs font-medium uppercase tracking-wide mb-1">
                Math validation
              </p>
              {ex.amounts.mathValid ? (
                <p className="text-sm text-emerald-700 font-medium">✓ Subtotal + VAT = Total checks out</p>
              ) : (
                <div>
                  <p className="text-sm text-amber-700 font-medium">Numbers don&apos;t add up</p>
                  {ex.amounts.mathNote && (
                    <p className="text-xs text-amber-600 mt-1">{ex.amounts.mathNote}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
