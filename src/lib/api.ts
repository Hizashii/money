const API_BASE = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type InvoiceRow = { vendor: string; date: string; total: string; vat: string };

export async function extractPdfs(files: File[]): Promise<InvoiceRow[]> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await fetch(`${API_BASE}/api/extract`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Extract failed");
  return res.json();
}

export async function listInvoices(): Promise<InvoiceRow[]> {
  const res = await fetch(`${API_BASE}/api/invoices`);
  if (!res.ok) throw new Error("Failed to load invoices");
  return res.json();
}

export async function clearInvoices(): Promise<void> {
  await fetch(`${API_BASE}/api/invoices`, { method: "DELETE" });
}
