export type InvoiceRow = { vendor: string; date: string; total: string; vat: string };

export async function extractPdfs(files: File[]): Promise<InvoiceRow[]> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  
  const res = await fetch("/api/extract", {
    method: "POST",
    body: form,
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Extract failed");
  }
  
  return res.json();
}

export async function downloadExcel(invoices: InvoiceRow[]): Promise<void> {
  const res = await fetch("/api/export-excel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invoices }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate Excel");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "invoices.xlsx";
  a.click();
  URL.revokeObjectURL(url);
}
