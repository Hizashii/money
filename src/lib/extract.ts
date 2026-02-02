/**
 * Extract invoice fields from PDF text using regex/heuristics.
 * Port of backend/extract.py
 */

export interface InvoiceRow {
  vendor: string;
  date: string;
  total: string;
  vat: string;
}

export function extractInvoice(text: string, filename: string = ""): InvoiceRow {
  if (!text || !text.trim()) {
    return { vendor: filename || "Unknown", date: "—", total: "—", vat: "—" };
  }

  // Vendor: often first non-empty line or after "From"/"Bill to"/"Invoice from"
  let vendor = "Unknown";
  const vendorPatterns = [
    /(?:From|Bill to|Invoice from|Vendor)\s*[:\s]*\n?\s*([A-Za-z0-9\s&.,\-]+?)(?:\n|$)/i,
    /^([A-Z][A-Za-z0-9\s&.,\-]{2,40})\s*$/m,
  ];
  for (const pattern of vendorPatterns) {
    const m = text.match(pattern);
    if (m) {
      vendor = m[1].trim().slice(0, 60);
      break;
    }
  }
  if (vendor === "Unknown") {
    const firstLine = text.trim().split("\n")[0].trim();
    if (firstLine.length > 2) {
      vendor = firstLine.slice(0, 60);
    }
  }

  // Date: common formats
  let date = "—";
  const datePatterns = [
    /(?:Date|Invoice date)\s*[:\s]*(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/i,
    /(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/,
    /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i,
  ];
  for (const pattern of datePatterns) {
    const m = text.match(pattern);
    if (m) {
      date = m[1].trim();
      break;
    }
  }

  // Total / amount due
  let total = "—";
  const totalPatterns = [
    /(?:Total|Amount due|Grand total)\s*[:\s]*[$€£]?\s*([\d,]+\.?\d*)/i,
    /[$€£]\s*([\d,]+\.\d{2})\s*(?:USD|EUR|GBP)?\s*$/m,
    /([\d,]+\.\d{2})\s*(?:USD|EUR|GBP)/,
  ];
  for (const pattern of totalPatterns) {
    const m = text.match(pattern);
    if (m) {
      total = m[1].trim();
      break;
    }
  }

  // VAT
  let vat = "—";
  const vatPatterns = [
    /(?:VAT|Tax|GST)\s*[:\s]*[$€£]?\s*([\d,]+\.?\d*)/i,
    /(?:VAT|Tax)\s*[:\s]*(\d+(?:\.\d+)?\s*%)/i,
  ];
  for (const pattern of vatPatterns) {
    const m = text.match(pattern);
    if (m) {
      vat = m[1].trim();
      break;
    }
  }

  return { vendor, date, total, vat };
}
