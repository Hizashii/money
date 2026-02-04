import { MAX_FILE_SIZE_BYTES } from "./constants";
import type { InvoiceExtraction, InvoiceRow } from "@/lib/extract";
import { extractionToRow } from "@/lib/extract";

export type { InvoiceRow, InvoiceExtraction };

export type ExtractResult = {
  extractions: InvoiceExtraction[];
  currency: string;
  summarySentence: string;
};

export async function extractPdfs(files: File[]): Promise<ExtractResult> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));

  const res = await fetch("/api/extract", {
    method: "POST",
    body: form,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || "Extraction failed. Please try again.");
  }

  return {
    extractions: body.extractions ?? [],
    currency: body.currency ?? "$",
    summarySentence: body.summarySentence ?? "",
  };
}

/** Flatten extractions to legacy rows for export/charts */
export function extractionsToRows(extractions: InvoiceExtraction[]): InvoiceRow[] {
  return extractions.map(extractionToRow);
}

/** Generate a default filename for export */
function exportFilename(ext: "xlsx" | "csv"): string {
  const date = new Date().toISOString().slice(0, 10);
  return `invoices-${date}.${ext}`;
}

export async function downloadExcel(
  invoices: InvoiceRow[],
  filename?: string,
  extractions?: InvoiceExtraction[],
  currency?: string
): Promise<void> {
  const name = filename || exportFilename("xlsx");
  const res = await fetch("/api/export-excel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      invoices,
      extractions: extractions ?? [],
      filename: name,
      currency: currency ?? "$",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate Excel. Please try again.");
  }

  const blob = await res.blob();
  const disp = res.headers.get("Content-Disposition");
  const downloadName = disp?.match(/filename="?([^";]+)"?/)?.[1]?.replace(/"/g, "") || name;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = downloadName;
  a.click();
  URL.revokeObjectURL(url);
}

/** Download as CSV (full structured fields when extractions provided). */
export function downloadCsv(
  invoices: InvoiceRow[],
  filename?: string,
  extractions?: InvoiceExtraction[]
): void {
  const name = filename || exportFilename("csv");
  const escape = (s: string) => `"${String(s).replace(/"/g, '""')}"`;

  if (extractions && extractions.length > 0) {
    const headers = [
      "Vendor",
      "Company ID",
      "Invoice #",
      "Invoice Date",
      "Due Date",
      "Payment Terms",
      "Subtotal",
      "VAT/Tax",
      "VAT %",
      "Total",
      "Currency",
      "Math OK",
      "Payment Method",
      "Beneficiary",
      "IBAN/Account",
      "Bank Country",
      "Consistent with Sender",
      "Legitimacy %",
      "Status",
      "Data Quality %",
      "Issues",
    ];
    const rows = extractions.map((ex) =>
      [
        ex.sender.companyName,
        ex.sender.companyRegistrationId,
        ex.invoiceDetails.invoiceNumber,
        ex.invoiceDetails.invoiceDate,
        ex.invoiceDetails.dueDate,
        ex.invoiceDetails.paymentTerms,
        ex.amounts.subtotal,
        ex.amounts.vatTaxAmount,
        ex.amounts.vatTaxRate,
        ex.amounts.total,
        ex.amounts.currency,
        ex.amounts.mathValid ? "Yes" : "No",
        ex.payment.paymentMethod,
        ex.payment.beneficiaryName,
        ex.payment.ibanOrAccount,
        ex.payment.bankCountry,
        ex.payment.consistentWithSender ? "Yes" : "No",
        ex.legitimacy.legitimacyScore,
        ex.legitimacy.legitimacyStatus,
        ex.legitimacy.dataQualityScore,
        ex.legitimacy.issues.join("; "),
      ].map(escape).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  const headers = ["Vendor", "Date", "Total", "VAT"];
  const rows = invoices.map((r) => [r.vendor, r.date, r.total, r.vat].map(escape).join(","));
  const csv = [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export { MAX_FILE_SIZE_BYTES };
