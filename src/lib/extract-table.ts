/**
 * Layer C — Table / line-item extraction from normalized text
 * Finds rows that look like: description, quantity, unit price, amount (or similar).
 * For production-grade table extraction (complex PDFs), use a Python microservice (e.g. Camelot).
 */

export interface LineItem {
  description: string;
  quantity: string;
  unitPrice: string;
  amount: string;
  vatRate?: string;
}

/**
 * Heuristic: detect a block of lines that look like a table (same column count, numbers in last cols).
 * Returns array of line items; empty if nothing convincing found.
 */
export function extractLineItemsFromText(normalizedText: string): LineItem[] {
  const lines = normalizedText.split("\n").map((l) => l.trim()).filter(Boolean);
  const rows: string[][] = [];
  for (const line of lines) {
    // Split on 2+ spaces or tab to get columns
    const cols = line.split(/\s{2,}|\t/).map((c) => c.trim()).filter(Boolean);
    if (cols.length >= 2) rows.push(cols);
  }

  if (rows.length < 2) return [];

  // Find contiguous block with same column count (likely table body)
  const colCounts = rows.map((r) => r.length);
  let bestStart = 0;
  let bestLen = 0;
  let bestCols = 0;
  let i = 0;
  while (i < rows.length) {
    const cols = colCounts[i];
    let j = i;
    while (j < rows.length && colCounts[j] === cols) j++;
    const len = j - i;
    if (len >= 2 && cols >= 2 && len > bestLen) {
      bestLen = len;
      bestStart = i;
      bestCols = cols;
    }
    i = j;
  }

  if (bestLen < 2 || bestCols < 2) return [];

  const tableRows = rows.slice(bestStart, bestStart + bestLen);
  const items: LineItem[] = [];

  for (const row of tableRows) {
    // Last column often amount; second-last unit price or quantity
    const amount = row[row.length - 1] ?? "";
    const prev = row[row.length - 2] ?? "";
    const prev2 = row[row.length - 3] ?? "";
    const desc = (row.slice(0, Math.max(1, row.length - 3)).join(" ") || row[0]) ?? "";
    const looksLikeAmount = /[\d.,]+/.test(amount);
    if (!looksLikeAmount) continue;

    items.push({
      description: desc.slice(0, 200),
      quantity: prev2 && /^\d+([.,]\d+)?$/.test(prev2.replace(/[.,]/g, (c) => (c === "," ? "." : c))) ? prev2 : "",
      unitPrice: prev && /[\d.,]+/.test(prev) ? prev : "",
      amount,
    });
  }

  return items;
}
