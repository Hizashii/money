import { SESSION_STORAGE_KEY } from "./constants";
import type { InvoiceExtraction } from "@/lib/extract";

export interface SavedExtraction {
  data: InvoiceExtraction[];
  currency: string;
  summarySentence?: string;
  savedAt: string;
}

export function saveExtraction(
  data: InvoiceExtraction[],
  currency: string,
  summarySentence?: string
): void {
  try {
    const payload: SavedExtraction = {
      data,
      currency,
      summarySentence,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

export function loadExtraction(): SavedExtraction | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedExtraction;
    if (!Array.isArray(parsed?.data) || !parsed.currency) return null;
    return {
      data: parsed.data,
      currency: parsed.currency ?? "$",
      summarySentence: parsed.summarySentence,
      savedAt: parsed.savedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function clearExtraction(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {}
}
