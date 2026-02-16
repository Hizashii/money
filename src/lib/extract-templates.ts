/**
 * Layer B — Template-based extraction (invoice2data-style)
 * Detect vendor by keywords, then apply vendor-specific or generic rules.
 */

export type ExtractionMethod = "template" | "generic" | "table" | "xml";
export type Confidence = "high" | "medium" | "low";

export interface VendorTemplate {
  id: string;
  name: string;
  /** Keywords that must appear in the document to match this template */
  keywords: string[];
  /** Optional: regex overrides for specific fields. Key = field name, value = regex string (first group = value). */
  fields?: Record<string, string>;
}

/** Built-in templates: add more as you discover vendor patterns. */
export const VENDOR_TEMPLATES: VendorTemplate[] = [
  {
    id: "generic-dk",
    name: "Generic (DK/CVR style)",
    keywords: ["CVR", "Moms", "Danmark", "DK-"],
    fields: {
      // Example: stricter invoice number for Danish
      // invoiceNumber: "(?:Faktura nr\\.?|Invoice no\\.?)\\s*[:#]?\\s*([A-Z0-9\\-]+)",
    },
  },
  {
    id: "generic-de",
    name: "Generic (DE/GmbH style)",
    keywords: ["GmbH", "MwSt", "Steuernummer", "DE"],
    fields: {},
  },
  {
    id: "generic-uk",
    name: "Generic (UK/VAT style)",
    keywords: ["VAT", "Limited", "Ltd", "GB"],
    fields: {},
  },
  {
    id: "generic",
    name: "Generic",
    keywords: ["invoice", "total", "amount"], // Fallback: almost every invoice has these
    fields: {},
  },
];

/**
 * Detect which template matches the document (first match by most keywords matched).
 */
export function detectVendorTemplate(normalizedText: string): VendorTemplate | null {
  const lower = normalizedText.toLowerCase();
  let best: { template: VendorTemplate; score: number } | null = null;

  for (const template of VENDOR_TEMPLATES) {
    const score = template.keywords.filter((k) =>
      lower.includes(k.toLowerCase())
    ).length;
    if (score === 0) continue;
    if (!best || score > best.score) {
      best = { template, score };
    }
  }

  return best?.template ?? null;
}

/**
 * Apply template-specific regex for a field if defined.
 * Returns null if no template override (caller uses generic extraction).
 */
export function getTemplateRegex(
  template: VendorTemplate | null,
  fieldName: string
): RegExp | null {
  if (!template?.fields?.[fieldName]) return null;
  try {
    return new RegExp(template.fields[fieldName], "i");
  } catch {
    return null;
  }
}
