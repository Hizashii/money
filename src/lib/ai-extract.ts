/**
 * AI-powered invoice extraction using Gemini.
 * Used as primary; regex (extractFullInvoiceWithLayers) is fallback.
 */

import { GoogleGenAI } from "@google/genai/node";
import type { InvoiceExtraction, LineItem } from "./extract";

const EXTRACT_PROMPT = `Extract the following fields from this invoice and return as JSON only. Use "—" for missing values.
Return valid JSON with these exact keys (no markdown, no code block):
- vendor_name (string)
- vendor_cvr (string, VAT/registration number)
- invoice_number (string)
- issue_date (string)
- due_date (string)
- line_items (array of { description: string, quantity: string or number, unit_price: string or number })
- subtotal (string)
- vat_amount (string)
- total (string)
- currency (string, e.g. EUR, USD)
- iban (string)
- beneficiary_name (string, payment recipient)
- bank_name (string)
- swift_bic (string)

Return only the JSON object, nothing else.`;

export interface GeminiInvoiceJson {
  vendor_name?: string;
  vendor_cvr?: string;
  invoice_number?: string;
  issue_date?: string;
  due_date?: string;
  line_items?: Array<{ description?: string; quantity?: string | number; unit_price?: string | number }>;
  subtotal?: string;
  vat_amount?: string;
  total?: string;
  currency?: string;
  iban?: string;
  beneficiary_name?: string;
  bank_name?: string;
  swift_bic?: string;
}

function emptySender() {
  return {
    companyName: "Unknown",
    companyRegistrationId: "—",
    address: "—",
    country: "—",
    companyLogoUrl: "",
    email: "—",
    phone: "—",
    website: "—",
  };
}

function emptyDetails() {
  return {
    invoiceNumber: "—",
    invoiceDate: "—",
    dueDate: "—",
    paymentTerms: "—",
    purchaseOrder: "—",
    customerRef: "—",
  };
}

function emptyAmounts(currency: string) {
  return {
    subtotal: "—",
    vatTaxAmount: "—",
    vatTaxRate: "—",
    total: "—",
    currency,
    mathValid: true,
    mathNote: "",
    discount: "—",
    shipping: "—",
  };
}

function emptyPayment() {
  return {
    paymentMethod: "Not specified",
    beneficiaryName: "—",
    ibanOrAccount: "—",
    bankName: "—",
    bankCountry: "—",
    swiftBic: "—",
    routingNumber: "—",
    consistentWithSender: true,
    consistencyNote: "",
    ibanValid: false,
  };
}

function parseJsonFromResponse(text: string): GeminiInvoiceJson | null {
  const raw = text.trim();
  let jsonStr = raw;
  const codeBlock = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) jsonStr = codeBlock[1].trim();
  try {
    return JSON.parse(jsonStr) as GeminiInvoiceJson;
  } catch {
    return null;
  }
}

function str(v: unknown): string {
  if (v == null || v === "") return "—";
  return String(v).trim() || "—";
}

function mapLineItems(items: GeminiInvoiceJson["line_items"]): LineItem[] {
  if (!Array.isArray(items)) return [];
  return items.map((row, i) => ({
    description: str(row?.description) !== "—" ? str(row?.description) : `Item ${i + 1}`,
    quantity: String(row?.quantity ?? ""),
    unitPrice: String(row?.unit_price ?? ""),
    amount: "",
  }));
}

/**
 * Build full InvoiceExtraction from Gemini JSON. Fills defaults for missing fields.
 */
export function aiResultToExtraction(
  json: GeminiInvoiceJson,
  filename: string
): InvoiceExtraction {
  const currency = json.currency?.trim() || "$";
  const vendorName = str(json.vendor_name) !== "—" ? str(json.vendor_name) : "Unknown";
  const beneficiaryName = str(json.beneficiary_name);
  const iban = str(json.iban);
  const subtotal = str(json.subtotal);
  const vatAmount = str(json.vat_amount);
  const total = str(json.total);

  const sender = {
    ...emptySender(),
    companyName: vendorName,
    companyRegistrationId: str(json.vendor_cvr),
  };

  const invoiceDetails = {
    ...emptyDetails(),
    invoiceNumber: str(json.invoice_number),
    invoiceDate: str(json.issue_date),
    dueDate: str(json.due_date),
  };

  const amounts = {
    ...emptyAmounts(currency),
    subtotal,
    vatTaxAmount: vatAmount,
    total,
    mathValid: true,
    mathNote: "",
  };

  const payment = {
    ...emptyPayment(),
    beneficiaryName: beneficiaryName !== "—" ? beneficiaryName : "—",
    ibanOrAccount: iban,
    bankName: str(json.bank_name),
    swiftBic: str(json.swift_bic),
    paymentMethod: iban !== "—" ? "Bank transfer" : "Not specified",
    consistentWithSender: true,
    consistencyNote: "",
    ibanValid: false,
  };

  const lineItems = mapLineItems(json.line_items);

  const fieldsFound =
    (vendorName !== "Unknown" ? 1 : 0) +
    (invoiceDetails.invoiceNumber !== "—" ? 1 : 0) +
    (invoiceDetails.invoiceDate !== "—" ? 1 : 0) +
    (total !== "—" ? 1 : 0) +
    (iban !== "—" ? 1 : 0);
  const legitimacy = {
    legitimacyScore: 85,
    legitimacyStatus: "Safe" as const,
    dataQualityScore: Math.round((fieldsFound / 10) * 100),
    issues: [] as string[],
    warnings: [] as string[],
    fieldsFound,
    fieldsTotal: 10,
  };

  const summarySentence = `Invoice from ${vendorName} for ${currency}${total} (AI-extracted).`;

  return {
    filename,
    sender,
    invoiceDetails,
    amounts,
    payment,
    legitimacy,
    summarySentence,
    lineItems: lineItems.length > 0 ? lineItems : undefined,
  };
}

/**
 * Call Gemini with PDF bytes; returns extraction or null on failure.
 */
export async function extractInvoiceWithAI(
  pdfBuffer: ArrayBuffer,
  filename: string
): Promise<InvoiceExtraction | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const base64 = Buffer.from(pdfBuffer).toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64,
              },
            },
            { text: EXTRACT_PROMPT },
          ],
        },
      ],
    });

    const text = response.text;
    if (!text?.trim()) return null;

    const json = parseJsonFromResponse(text);
    if (!json) return null;

    return aiResultToExtraction(json, filename);
  } catch (err) {
    console.error("AI extract error:", err);
    return null;
  }
}
