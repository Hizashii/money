/**
 * ENHANCED Invoice Extraction from PDF text
 * 3-layer: normalization (A) + template (B) + table/line items (C)
 * Confidence + method per field for "Fix extraction" workflow.
 */

import { normalizePdfText } from "./pdf-normalize";
import { detectVendorTemplate, type Confidence, type ExtractionMethod } from "./extract-templates";
import { extractLineItemsFromText, type LineItem } from "./extract-table";

export type { Confidence, ExtractionMethod, LineItem };

export interface FieldMeta {
  confidence: Confidence;
  method: ExtractionMethod;
}

export interface ExtractionMeta {
  vendorTemplateId: string | null;
  vendorTemplateName: string | null;
  /** Per-field confidence and method (for Fix extraction UI). */
  fieldMeta: Record<string, FieldMeta>;
  /** Whether Layer A normalization was applied. */
  normalized: boolean;
}

export interface SenderIdentity {
  companyName: string;
  companyRegistrationId: string;
  address: string;
  country: string;
  companyLogoUrl: string;
  email: string;
  phone: string;
  website: string;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  purchaseOrder: string;
  customerRef: string;
}

export interface Amounts {
  subtotal: string;
  vatTaxAmount: string;
  vatTaxRate: string;
  total: string;
  currency: string;
  mathValid: boolean;
  mathNote: string;
  discount: string;
  shipping: string;
}

export interface PaymentDestination {
  paymentMethod: string;
  beneficiaryName: string;
  ibanOrAccount: string;
  bankName: string;
  bankCountry: string;
  swiftBic: string;
  routingNumber: string;
  consistentWithSender: boolean;
  consistencyNote: string;
  ibanValid: boolean;
}

export type LegitimacyStatus = "Safe" | "Needs Review" | "High Risk";

export interface LegitimacyQuality {
  legitimacyScore: number;
  legitimacyStatus: LegitimacyStatus;
  dataQualityScore: number;
  issues: string[];
  warnings: string[];
  fieldsFound: number;
  fieldsTotal: number;
}

export interface InvoiceExtraction {
  filename: string;
  sender: SenderIdentity;
  invoiceDetails: InvoiceDetails;
  amounts: Amounts;
  payment: PaymentDestination;
  legitimacy: LegitimacyQuality;
  summarySentence: string;
  /** Line items from table extraction (Layer C). */
  lineItems?: LineItem[];
  /** Confidence and method per field; used for Fix extraction. */
  extractionMeta?: ExtractionMeta;
}

export interface InvoiceRow {
  vendor: string;
  date: string;
  total: string;
  vat: string;
}

// ============================================================================
// CURRENCY DETECTION - Extended
// ============================================================================

const CURRENCY_PATTERNS: [RegExp, string][] = [
  [/€|EUR|euro|euros/i, "€"],
  [/£|GBP|pound|pounds sterling/i, "£"],
  [/\$|USD|US\s*dollars?|dollars?/i, "$"],
  [/kr\.?|DKK|danish\s*krone/i, "DKK"],
  [/SEK|swedish\s*kron/i, "SEK"],
  [/NOK|norwegian\s*kron/i, "NOK"],
  [/CHF|swiss\s*franc/i, "CHF"],
  [/¥|JPY|yen/i, "¥"],
  [/CNY|RMB|yuan|renminbi/i, "¥"],
  [/AUD|australian\s*dollar/i, "A$"],
  [/CAD|canadian\s*dollar/i, "C$"],
  [/PLN|złoty|zł/i, "PLN"],
  [/CZK|czech\s*kron/i, "CZK"],
  [/HUF|forint/i, "HUF"],
  [/INR|rupee/i, "₹"],
];

export function detectCurrency(text: string): string {
  if (!text) return "$";
  for (const [pattern, symbol] of CURRENCY_PATTERNS) {
    if (pattern.test(text)) return symbol;
  }
  return "$";
}

// ============================================================================
// NUMBER PARSING - Handle US and European formats
// ============================================================================

function parseAmount(s: string): number {
  if (!s || s === "—" || s === "-") return 0;
  let cleaned = String(s).trim();
  
  // Remove currency symbols and letters
  cleaned = cleaned.replace(/[€$£¥₹A-Za-z]/g, "").trim();
  
  // Detect format: European (1.234,56) vs US (1,234.56)
  const hasCommaDecimal = /\d,\d{2}$/.test(cleaned); // ends with ,XX
  const hasDotDecimal = /\d\.\d{2}$/.test(cleaned);   // ends with .XX
  
  if (hasCommaDecimal && !hasDotDecimal) {
    // European format: 1.234,56 -> 1234.56
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else {
    // US format or no decimal: 1,234.56 -> 1234.56
    cleaned = cleaned.replace(/,/g, "");
  }
  
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function normalizeNumber(s: string): number {
  return parseAmount(s);
}

// ============================================================================
// IBAN VALIDATION - Checksum verification
// ============================================================================

function validateIBAN(iban: string): boolean {
  if (!iban || iban === "—") return false;
  
  // Remove spaces and convert to uppercase
  const cleaned = iban.replace(/\s/g, "").toUpperCase();
  
  // Basic format check: 2 letters + 2 digits + up to 30 alphanumeric
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/.test(cleaned)) return false;
  
  // IBAN length by country
  const ibanLengths: Record<string, number> = {
    AL: 28, AD: 24, AT: 20, AZ: 28, BH: 22, BY: 28, BE: 16, BA: 20,
    BR: 29, BG: 22, CR: 22, HR: 21, CY: 28, CZ: 24, DK: 18, DO: 28,
    EE: 20, FO: 18, FI: 18, FR: 27, GE: 22, DE: 22, GI: 23, GR: 27,
    GL: 18, GT: 28, HU: 28, IS: 26, IE: 22, IL: 23, IT: 27, JO: 30,
    KZ: 20, XK: 20, KW: 30, LV: 21, LB: 28, LI: 21, LT: 20, LU: 20,
    MK: 19, MT: 31, MR: 27, MU: 30, MD: 24, MC: 27, ME: 22, NL: 18,
    NO: 15, PK: 24, PS: 29, PL: 28, PT: 25, QA: 29, RO: 24, LC: 32,
    SM: 27, SA: 24, RS: 22, SC: 31, SK: 24, SI: 19, ES: 24, SE: 24,
    CH: 21, TL: 23, TN: 24, TR: 26, UA: 29, AE: 23, GB: 22, VG: 24,
  };
  
  const countryCode = cleaned.slice(0, 2);
  const expectedLength = ibanLengths[countryCode];
  if (expectedLength && cleaned.length !== expectedLength) return false;
  
  // Mod 97 checksum validation
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  const numericString = rearranged.replace(/[A-Z]/g, (char) => 
    String(char.charCodeAt(0) - 55)
  );
  
  // Calculate mod 97 using string arithmetic (handles big numbers)
  let remainder = 0;
  for (const digit of numericString) {
    remainder = (remainder * 10 + parseInt(digit, 10)) % 97;
  }
  
  return remainder === 1;
}

// ============================================================================
// COMPANY DETECTION - Legal suffixes and patterns
// ============================================================================

const COMPANY_SUFFIXES = [
  // English
  "Ltd", "Limited", "LLC", "Inc", "Incorporated", "Corp", "Corporation",
  "Co", "Company", "PLC", "LP", "LLP",
  // German
  "GmbH", "AG", "KG", "OHG", "UG", "e\\.?V\\.?", "eG",
  // French
  "SA", "SARL", "SAS", "EURL", "SNC",
  // Spanish/Italian
  "SL", "SRL", "SpA", "Srl",
  // Nordic
  "A/S", "ApS", "AS", "AB", "Oy", "Oyj",
  // Dutch/Belgian
  "BV", "NV", "VOF", "CV",
  // Other
  "Pty", "Pvt", "Pte",
];

const COMPANY_SUFFIX_PATTERN = new RegExp(
  `\\b(${COMPANY_SUFFIXES.join("|")})\\b\\.?`,
  "i"
);

function extractCompanyName(text: string): string {
  // Try labeled patterns first
  const labeledPatterns = [
    /(?:From|Bill\s*from|Invoice\s*from|Vendor|Seller|Issued\s*by|Supplier|Company)\s*[:\s]*\n?\s*([^\n]{3,80})/i,
    /(?:Company\s*name|Business\s*name|Trading\s*as|T\/A)\s*[:\s]*\n?\s*([^\n]{3,80})/i,
  ];
  
  for (const pattern of labeledPatterns) {
    const m = text.match(pattern);
    if (m) {
      const name = m[1].trim();
      // Validate it looks like a company name
      if (name.length >= 3 && !/^\d+$/.test(name)) {
        return cleanCompanyName(name);
      }
    }
  }
  
  // Look for lines containing company suffixes
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 2);
  for (const line of lines.slice(0, 15)) { // Check first 15 lines
    if (COMPANY_SUFFIX_PATTERN.test(line)) {
      const cleaned = cleanCompanyName(line);
      if (cleaned.length >= 3 && cleaned.length <= 80) {
        return cleaned;
      }
    }
  }
  
  // Fallback: first substantial line that looks like a name
  for (const line of lines.slice(0, 5)) {
    if (
      line.length >= 3 &&
      line.length <= 60 &&
      /^[A-Z]/.test(line) &&
      !/^\d/.test(line) &&
      !/^(invoice|date|total|amount|tax|vat|payment|to:|from:)/i.test(line)
    ) {
      return cleanCompanyName(line);
    }
  }
  
  return "Unknown";
}

function cleanCompanyName(name: string): string {
  return name
    .replace(/[,;:]+$/, "") // Remove trailing punctuation
    .replace(/\s+/g, " ")   // Normalize whitespace
    .trim()
    .slice(0, 80);
}

// ============================================================================
// VAT/TAX ID DETECTION - Country-specific patterns
// ============================================================================

const VAT_PATTERNS = [
  // EU VAT numbers (2 letters + 8-12 chars)
  /\b((?:AT|BE|BG|CY|CZ|DE|DK|EE|EL|ES|FI|FR|GB|HR|HU|IE|IT|LT|LU|LV|MT|NL|PL|PT|RO|SE|SI|SK)[A-Z0-9]{8,12})\b/i,
  // Generic labeled
  /(?:VAT|TVA|MwSt|BTW|IVA|USt|MOMS)\s*(?:no\.?|number|ID|Nr\.?|#)?\s*[:\s]*([A-Z]{0,2}[0-9A-Z\-\s]{6,20})/i,
  /(?:CVR|Org\.?\s*nr?\.?|Company\s*(?:reg\.?|registration)\s*(?:no\.?|number)?|Registration|ABN|ACN|EIN|TIN)\s*[:\s#]*([0-9A-Z\-\s]{6,20})/i,
  // Tax ID
  /(?:Tax\s*ID|Tax\s*number|Steuernummer|NIF|CIF|SIRET|SIREN)\s*[:\s]*([0-9A-Z\-\s\/]{6,20})/i,
  // Standalone EU VAT format
  /\b([A-Z]{2}[0-9]{8,10})\b/,
];

function extractVatId(text: string): string {
  for (const pattern of VAT_PATTERNS) {
    const m = text.match(pattern);
    if (m) {
      const id = m[1].replace(/\s+/g, "").trim();
      if (id.length >= 6 && id.length <= 20) {
        return id.slice(0, 20);
      }
    }
  }
  return "—";
}

// ============================================================================
// DATE PARSING - Many international formats
// ============================================================================

const DATE_PATTERNS = [
  // Labeled patterns (highest priority)
  /(?:Invoice\s*date|Date\s*of\s*invoice|Issue\s*date|Dated|Fakturadato|Rechnungsdatum|Date\s*de\s*facture)\s*[:\s]*([^\n]{6,20})/i,
  /(?:Date)\s*[:\s]*([^\n]{6,20})/i,
  
  // ISO format: 2024-01-25
  /\b(\d{4}[-/]\d{1,2}[-/]\d{1,2})\b/,
  
  // US format: 01/25/2024 or 1/25/24
  /\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/,
  
  // European format: 25.01.2024 or 25-01-2024
  /\b(\d{1,2}[.\-]\d{1,2}[.\-]\d{2,4})\b/,
  
  // Written format: January 25, 2024 or 25 January 2024
  /\b(\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[,\s]+\d{2,4})\b/i,
  /\b((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}[,\s]+\d{2,4})\b/i,
];

function extractDate(text: string, label: string): string {
  // Try labeled pattern first
  const labeledPattern = new RegExp(
    `(?:${label})\\s*[:\\s]*([^\\n]{6,25})`,
    "i"
  );
  const labeledMatch = text.match(labeledPattern);
  if (labeledMatch) {
    const dateStr = cleanDate(labeledMatch[1]);
    if (dateStr) return dateStr;
  }
  
  // Try generic date patterns
  for (const pattern of DATE_PATTERNS) {
    const m = text.match(pattern);
    if (m) {
      const dateStr = cleanDate(m[1]);
      if (dateStr) return dateStr;
    }
  }
  
  return "—";
}

function cleanDate(s: string): string {
  if (!s) return "";
  const cleaned = s.trim().replace(/[,;:]+$/, "");
  // Validate it looks like a date
  if (
    /\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}/.test(cleaned) ||
    /\d{1,2}\s+[A-Za-z]+\s+\d{2,4}/.test(cleaned) ||
    /[A-Za-z]+\s+\d{1,2}[,\s]+\d{2,4}/.test(cleaned)
  ) {
    return cleaned.slice(0, 25);
  }
  return "";
}

// ============================================================================
// INVOICE NUMBER DETECTION
// ============================================================================

const INVOICE_NUMBER_PATTERNS = [
  /(?:Invoice\s*(?:no\.?|number|#|ID)|Faktura(?:nummer)?|Rechnung(?:snummer)?|Facture\s*n[°o]?)\s*[:\s#]*([A-Z0-9][A-Z0-9\-\/\.]{2,25})/i,
  /(?:Inv\.?\s*(?:no\.?|#)?|Reference|Ref\.?\s*(?:no\.?|#)?)\s*[:\s#]*([A-Z0-9][A-Z0-9\-\/\.]{2,25})/i,
  /(?:Document\s*(?:no\.?|number|#)|Doc\.?\s*(?:no\.?|#)?)\s*[:\s#]*([A-Z0-9][A-Z0-9\-\/\.]{2,25})/i,
  // Pattern like INV-12345 or 2024-001
  /\b(INV[\-\/]?\d{3,10})\b/i,
  /\b(\d{4}[\-\/]\d{3,6})\b/,
];

function extractInvoiceNumber(text: string): string {
  for (const pattern of INVOICE_NUMBER_PATTERNS) {
    const m = text.match(pattern);
    if (m) {
      const num = m[1].trim();
      if (num.length >= 3 && num.length <= 30) {
        return num;
      }
    }
  }
  return "—";
}

// ============================================================================
// AMOUNT EXTRACTION - Enhanced patterns
// ============================================================================

function extractAmount(text: string, labels: string[]): string {
  const labelPattern = labels.join("|");
  
  const patterns = [
    // Labeled with currency symbol
    new RegExp(`(?:${labelPattern})\\s*[:\\s]*([€$£¥]\\s*[\\d.,]+|[\\d.,]+\\s*[€$£¥]|[\\d.,]+\\s*(?:EUR|USD|GBP|DKK))`, "i"),
    // Labeled without currency
    new RegExp(`(?:${labelPattern})\\s*[:\\s]*([\\d][\\d.,]{1,15})`, "i"),
  ];
  
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      const amount = m[1].replace(/[€$£¥]/g, "").trim();
      if (parseAmount(amount) > 0) {
        return amount;
      }
    }
  }
  
  return "—";
}

// ============================================================================
// CONTACT EXTRACTION - Email, Phone, Website
// ============================================================================

function extractEmail(text: string): string {
  const m = text.match(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b/);
  return m ? m[1].toLowerCase() : "—";
}

function extractPhone(text: string): string {
  // Various phone formats
  const patterns = [
    /(?:Tel\.?|Phone|Ph\.?|Mob(?:ile)?|Fax)\s*[:\s]*([+\d\s\-().]{8,20})/i,
    /\b(\+\d{1,3}[\s\-]?\d{2,4}[\s\-]?\d{3,4}[\s\-]?\d{3,4})\b/,
    /\b(\(\d{2,4}\)\s*\d{3,4}[\s\-]?\d{3,4})\b/,
  ];
  
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      const phone = m[1].trim();
      if (phone.replace(/\D/g, "").length >= 8) {
        return phone;
      }
    }
  }
  return "—";
}

function extractWebsite(text: string): string {
  const m = text.match(/\b((?:https?:\/\/)?(?:www\.)?[a-z0-9][a-z0-9\-]*\.[a-z]{2,}(?:\/[^\s]*)?)\b/i);
  if (m) {
    const url = m[1].toLowerCase();
    if (!url.includes("@")) { // Not an email
      return url;
    }
  }
  return "—";
}

// ============================================================================
// ADDRESS EXTRACTION
// ============================================================================

function extractAddress(text: string): string {
  const patterns = [
    /(?:Address|Registered\s*(?:office|address)|Business\s*address|Street)\s*[:\s]*\n?\s*([^\n]+(?:\n[^\n]+){0,3})/i,
    // Look for street patterns
    /(\d+[A-Za-z]?\s+[A-Za-z\s]+(?:Street|St\.?|Avenue|Ave\.?|Road|Rd\.?|Boulevard|Blvd\.?|Lane|Ln\.?|Drive|Dr\.?|Way|Place|Pl\.?|Court|Ct\.?)[^\n]*(?:\n[^\n]{5,50})?)/i,
    // European address pattern (street name first, then number)
    /([A-Za-z][A-Za-z\s]+\s+\d+[A-Za-z]?[,\s]+\d{4,5}\s+[A-Za-z\s]+)/i,
  ];
  
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      const addr = m[1].replace(/\n+/g, ", ").trim();
      if (addr.length >= 10 && addr.length <= 150) {
        return addr;
      }
    }
  }
  return "—";
}

// ============================================================================
// COUNTRY DETECTION - Extended
// ============================================================================

const COUNTRY_MAP: Record<string, string> = {
  // ISO codes
  DK: "Denmark", DE: "Germany", GB: "United Kingdom", UK: "United Kingdom",
  FR: "France", NL: "Netherlands", BE: "Belgium", AT: "Austria",
  CH: "Switzerland", IT: "Italy", ES: "Spain", PT: "Portugal",
  SE: "Sweden", NO: "Norway", FI: "Finland", PL: "Poland",
  CZ: "Czech Republic", HU: "Hungary", IE: "Ireland", US: "USA",
  CA: "Canada", AU: "Australia", NZ: "New Zealand", JP: "Japan",
  CN: "China", IN: "India", BR: "Brazil", MX: "Mexico",
  // Names
  DENMARK: "Denmark", GERMANY: "Germany", DEUTSCHLAND: "Germany",
  FRANCE: "France", NETHERLANDS: "Netherlands", HOLLAND: "Netherlands",
  BELGIUM: "Belgium", AUSTRIA: "Austria", ÖSTERREICH: "Austria",
  SWITZERLAND: "Switzerland", SCHWEIZ: "Switzerland", SUISSE: "Switzerland",
  ITALY: "Italy", ITALIA: "Italy", SPAIN: "Spain", ESPAÑA: "Spain",
  PORTUGAL: "Portugal", SWEDEN: "Sweden", SVERIGE: "Sweden",
  NORWAY: "Norway", NORGE: "Norway", FINLAND: "Finland", SUOMI: "Finland",
  POLAND: "Poland", POLSKA: "Poland", IRELAND: "Ireland",
  "UNITED STATES": "USA", "UNITED KINGDOM": "United Kingdom",
};

function extractCountry(text: string, ibanCode?: string): string {
  // Try IBAN country code first
  if (ibanCode && COUNTRY_MAP[ibanCode.toUpperCase()]) {
    return COUNTRY_MAP[ibanCode.toUpperCase()];
  }
  
  // Try labeled pattern
  const labeledMatch = text.match(/(?:Country|Land|Pays|País)\s*[:\s]*([A-Za-z\s]+)/i);
  if (labeledMatch) {
    const country = labeledMatch[1].trim().toUpperCase();
    if (COUNTRY_MAP[country]) return COUNTRY_MAP[country];
    if (country.length >= 2 && country.length <= 30) return labeledMatch[1].trim();
  }
  
  // Search for country names/codes in text
  const textUpper = text.toUpperCase();
  for (const [key, value] of Object.entries(COUNTRY_MAP)) {
    if (textUpper.includes(key) && key.length >= 4) { // Avoid short codes matching randomly
      return value;
    }
  }
  
  return "—";
}

// ============================================================================
// PAYMENT INFORMATION EXTRACTION
// ============================================================================

function extractIBAN(text: string): { iban: string; valid: boolean } {
  // Standard IBAN pattern
  const patterns = [
    /(?:IBAN)\s*[:\s]*([A-Z]{2}\s*\d{2}[\sA-Z0-9]{10,30})/i,
    /\b([A-Z]{2}\d{2}\s?(?:[A-Z0-9]{4}\s?){2,7}[A-Z0-9]{1,4})\b/,
  ];
  
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      const iban = m[1].replace(/\s/g, "").toUpperCase();
      if (iban.length >= 15 && iban.length <= 34) {
        return { iban, valid: validateIBAN(iban) };
      }
    }
  }
  
  // Try account number as fallback
  const accMatch = text.match(/(?:Account\s*(?:no\.?|number)|Bank\s*account|Konto(?:nummer)?)\s*[:\s]*([A-Z0-9\-\s]{6,25})/i);
  if (accMatch) {
    return { iban: accMatch[1].replace(/\s/g, "").trim(), valid: false };
  }
  
  return { iban: "—", valid: false };
}

function extractSwiftBic(text: string): string {
  const patterns = [
    /(?:SWIFT|BIC|SWIFT\/BIC)\s*[:\s]*([A-Z]{6}[A-Z0-9]{2,5})/i,
    /\b([A-Z]{6}[A-Z0-9]{2}(?:[A-Z0-9]{3})?)\b/, // Standard BIC format
  ];
  
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      const bic = m[1].toUpperCase();
      if (bic.length >= 8 && bic.length <= 11) {
        return bic;
      }
    }
  }
  return "—";
}

function extractBankName(text: string): string {
  const patterns = [
    /(?:Bank(?:\s*name)?|Banque|Kreditinstitut)\s*[:\s]*([A-Za-z][A-Za-z0-9\s&.,\-']{3,50})/i,
  ];
  
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      return m[1].trim().slice(0, 50);
    }
  }
  return "—";
}

function extractBeneficiary(text: string): string {
  const patterns = [
    /(?:Beneficiary|Pay\s*to|Account\s*(?:holder|name)|Name\s*(?:on\s*account)?|Payable\s*to|Kontoinhaber|Begunstigde)\s*[:\s]*([A-Za-z][A-Za-z0-9\s&.,\-'()]{2,80})/i,
  ];
  
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      return m[1].trim().slice(0, 80);
    }
  }
  return "—";
}

// ============================================================================
// NAME MATCHING - Smart comparison for beneficiary vs sender
// ============================================================================

function normalizeForComparison(name: string): string {
  return name
    .toLowerCase()
    .replace(/[.,\-'()]/g, " ")
    .replace(new RegExp(`\\b(${COMPANY_SUFFIXES.join("|")})\\b`, "gi"), "")
    .replace(/\s+/g, " ")
    .trim();
}

function namesMatch(name1: string, name2: string): boolean {
  if (name1 === "—" || name2 === "—" || name1 === "Unknown" || name2 === "Unknown") {
    return true; // Can't determine, assume OK
  }
  
  const n1 = normalizeForComparison(name1);
  const n2 = normalizeForComparison(name2);
  
  // Exact match after normalization
  if (n1 === n2) return true;
  
  // One contains the other
  if (n1.includes(n2) || n2.includes(n1)) return true;
  
  // Significant word overlap (at least 2 words of 3+ chars match)
  const words1 = n1.split(" ").filter(w => w.length >= 3);
  const words2 = n2.split(" ").filter(w => w.length >= 3);
  const matchingWords = words1.filter(w => words2.includes(w));
  
  if (matchingWords.length >= 2) return true;
  if (matchingWords.length >= 1 && (words1.length <= 2 || words2.length <= 2)) return true;
  
  return false;
}

// ============================================================================
// MAIN EXTRACTION FUNCTION
// ============================================================================

export function extractFullInvoice(text: string, filename: string = ""): InvoiceExtraction {
  const currency = detectCurrency(text);
  
  // ----- 1) Sender Identity -----
  const companyName = extractCompanyName(text);
  const companyRegistrationId = extractVatId(text);
  const address = extractAddress(text);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const website = extractWebsite(text);
  
  const { iban: ibanOrAccount, valid: ibanValid } = extractIBAN(text);
  const ibanCountryCode = ibanOrAccount !== "—" ? ibanOrAccount.slice(0, 2) : "";
  const country = extractCountry(text, ibanCountryCode);
  
  const sender: SenderIdentity = {
    companyName,
    companyRegistrationId,
    address,
    country,
    companyLogoUrl: "",
    email,
    phone,
    website,
  };
  
  // ----- 2) Invoice Details -----
  const invoiceNumber = extractInvoiceNumber(text);
  const invoiceDate = extractDate(text, "Invoice\\s*date|Date\\s*of\\s*invoice|Issue\\s*date|Dated|Date");
  const dueDate = extractDate(text, "Due\\s*date|Payment\\s*due|Pay\\s*by|Due");
  
  let paymentTerms = "—";
  const termsMatch = text.match(/(?:Payment\s*terms?|Terms|Betalingsvilkår|Zahlungsbedingungen)\s*[:\s]*([^\n]{3,40})/i);
  if (termsMatch) paymentTerms = termsMatch[1].trim();
  if (paymentTerms === "—") {
    const netMatch = text.match(/\b(Net\s*\d+|Due\s*(?:on|upon)\s*receipt|\d+\s*days?\s*(?:net)?)\b/i);
    if (netMatch) paymentTerms = netMatch[1].trim();
  }
  
  let purchaseOrder = "—";
  const poMatch = text.match(/(?:P\.?O\.?|Purchase\s*order|Order)\s*(?:no\.?|number|#)?\s*[:\s]*([A-Z0-9\-]{3,20})/i);
  if (poMatch) purchaseOrder = poMatch[1].trim();
  
  let customerRef = "—";
  const refMatch = text.match(/(?:Customer\s*(?:ref\.?|reference)|Your\s*ref\.?|Client\s*(?:no\.?|number))\s*[:\s]*([A-Z0-9\-]{3,20})/i);
  if (refMatch) customerRef = refMatch[1].trim();
  
  const invoiceDetails: InvoiceDetails = {
    invoiceNumber,
    invoiceDate,
    dueDate,
    paymentTerms,
    purchaseOrder,
    customerRef,
  };
  
  // ----- 3) Amounts -----
  const subtotal = extractAmount(text, ["Subtotal", "Sub\\s*total", "Net\\s*(?:amount)?", "Amount\\s*before\\s*(?:tax|VAT)", "Netto"]);
  const vatTaxAmount = extractAmount(text, ["VAT", "Tax", "GST", "TVA", "MwSt", "Moms", "BTW", "IVA"]);
  const total = extractAmount(text, ["Total", "Amount\\s*due", "Grand\\s*total", "Total\\s*due", "Balance\\s*due", "Gesamt", "Totaal"]);
  const discount = extractAmount(text, ["Discount", "Rabatt", "Korting", "Remise"]);
  const shipping = extractAmount(text, ["Shipping", "Freight", "Delivery", "Versand", "Verzendkosten"]);
  
  // Extract VAT rate
  let vatTaxRate = "—";
  const ratePatterns = [
    /(\d+(?:[.,]\d+)?)\s*%\s*(?:VAT|tax|TVA|MwSt|Moms)/i,
    /(?:VAT|Tax|TVA|MwSt|Moms)\s*[@:]\s*(\d+(?:[.,]\d+)?)\s*%/i,
    /(?:VAT|Tax)\s*\((\d+(?:[.,]\d+)?)\s*%\)/i,
  ];
  for (const pattern of ratePatterns) {
    const m = text.match(pattern);
    if (m) {
      vatTaxRate = m[1].replace(",", ".") + "%";
      break;
    }
  }
  
  // Math validation
  const subNum = parseAmount(subtotal);
  const vatNum = parseAmount(vatTaxAmount);
  const totalNum = parseAmount(total);
  const discountNum = parseAmount(discount);
  const shippingNum = parseAmount(shipping);
  
  const expectedTotal = subNum + vatNum - discountNum + shippingNum;
  const tolerance = Math.max(0.05, totalNum * 0.001); // 0.1% or 0.05
  const mathValid = totalNum <= 0 || 
    Math.abs(totalNum - expectedTotal) <= tolerance || 
    (subNum <= 0 && vatNum <= 0) ||
    Math.abs(totalNum - (subNum + vatNum)) <= tolerance; // Simple case
  
  let mathNote = "";
  if (totalNum > 0 && (subNum > 0 || vatNum > 0) && !mathValid) {
    mathNote = `Expected: ${subNum.toFixed(2)} + ${vatNum.toFixed(2)} = ${expectedTotal.toFixed(2)}, but total is ${totalNum.toFixed(2)}`;
  } else if (mathValid && totalNum > 0 && subNum > 0) {
    mathNote = "Subtotal + VAT = Total ✓";
  }
  
  const amounts: Amounts = {
    subtotal: subtotal !== "—" ? subtotal : (subNum > 0 ? subNum.toFixed(2) : "—"),
    vatTaxAmount: vatTaxAmount !== "—" ? vatTaxAmount : (vatNum > 0 ? vatNum.toFixed(2) : "—"),
    vatTaxRate,
    total: total !== "—" ? total : (totalNum > 0 ? totalNum.toFixed(2) : "—"),
    currency,
    mathValid,
    mathNote,
    discount: discount !== "—" ? discount : "—",
    shipping: shipping !== "—" ? shipping : "—",
  };
  
  // ----- 4) Payment Destination -----
  let paymentMethod = "Not specified";
  if (/\b(bank\s*transfer|wire\s*transfer|IBAN|SWIFT|BIC|direct\s*deposit|EFT)\b/i.test(text)) {
    paymentMethod = "Bank transfer";
  } else if (/\b(credit\s*card|debit\s*card|visa|mastercard|amex|payment\s*card)\b/i.test(text)) {
    paymentMethod = "Card";
  } else if (/\bpaypal\b/i.test(text)) {
    paymentMethod = "PayPal";
  } else if (/\b(check|cheque)\b/i.test(text)) {
    paymentMethod = "Check";
  } else if (/\b(cash|kontant)\b/i.test(text)) {
    paymentMethod = "Cash";
  }
  
  const beneficiaryName = extractBeneficiary(text);
  const swiftBic = extractSwiftBic(text);
  const bankName = extractBankName(text);
  const bankCountry = extractCountry(text, ibanCountryCode);
  
  const routingMatch = text.match(/(?:Routing\s*(?:no\.?|number)|ABA|Sort\s*code)\s*[:\s]*(\d{6,9})/i);
  const routingNumber = routingMatch ? routingMatch[1] : "—";
  
  const consistentWithSender = namesMatch(beneficiaryName, companyName);
  let consistencyNote = consistentWithSender 
    ? "Payment recipient matches sender identity." 
    : "⚠️ Beneficiary name doesn't match invoice sender—verify before paying!";
  
  const payment: PaymentDestination = {
    paymentMethod,
    beneficiaryName,
    ibanOrAccount,
    bankName,
    bankCountry,
    swiftBic,
    routingNumber,
    consistentWithSender,
    consistencyNote,
    ibanValid,
  };
  
  // ----- 5) Legitimacy & Quality Assessment -----
  const issues: string[] = [];
  const warnings: string[] = [];
  
  // Critical issues
  if (invoiceNumber === "—") issues.push("Missing invoice number");
  if (companyRegistrationId === "—") issues.push("Missing company VAT/registration ID");
  if (!mathValid && totalNum > 0 && subNum > 0) issues.push("Invoice math doesn't add up");
  if (!consistentWithSender && beneficiaryName !== "—") issues.push("Payment beneficiary doesn't match sender");
  if (ibanOrAccount !== "—" && !ibanValid && ibanOrAccount.length >= 15) issues.push("IBAN checksum validation failed");
  if (total === "—" || totalNum <= 0) issues.push("Missing or invalid total amount");
  if (invoiceDate === "—") issues.push("Missing invoice date");
  
  // Warnings
  if (vatNum > 0 && totalNum > 0 && vatNum / totalNum > 0.35) {
    warnings.push(`VAT is ${((vatNum / totalNum) * 100).toFixed(0)}% of total (unusually high)`);
  }
  if (vatNum <= 0 && totalNum > 100) {
    warnings.push("No VAT/tax found on invoice");
  }
  if (text.length < 200) {
    warnings.push("Very short document—may be incomplete");
  }
  if (dueDate === "—" && totalNum > 0) {
    warnings.push("No due date specified");
  }
  if (address === "—") {
    warnings.push("No company address found");
  }
  if (email === "—" && phone === "—" && website === "—") {
    warnings.push("No contact information found");
  }
  
  // Count fields found
  const fieldsTotal = 15;
  let fieldsFound = 0;
  if (companyName !== "Unknown") fieldsFound++;
  if (companyRegistrationId !== "—") fieldsFound++;
  if (address !== "—") fieldsFound++;
  if (country !== "—") fieldsFound++;
  if (invoiceNumber !== "—") fieldsFound++;
  if (invoiceDate !== "—") fieldsFound++;
  if (dueDate !== "—") fieldsFound++;
  if (total !== "—" && totalNum > 0) fieldsFound++;
  if (subtotal !== "—" && subNum > 0) fieldsFound++;
  if (vatTaxAmount !== "—" && vatNum > 0) fieldsFound++;
  if (ibanOrAccount !== "—") fieldsFound++;
  if (beneficiaryName !== "—") fieldsFound++;
  if (email !== "—") fieldsFound++;
  if (phone !== "—") fieldsFound++;
  if (paymentMethod !== "Not specified") fieldsFound++;
  
  // Calculate scores
  const dataQualityScore = Math.round((fieldsFound / fieldsTotal) * 100);
  
  let legitimacyScore = 100;
  legitimacyScore -= issues.length * 15;
  legitimacyScore -= warnings.length * 5;
  if (!mathValid && totalNum > 0) legitimacyScore -= 10;
  if (!consistentWithSender && beneficiaryName !== "—") legitimacyScore -= 15;
  if (!ibanValid && ibanOrAccount !== "—" && ibanOrAccount.length >= 15) legitimacyScore -= 10;
  legitimacyScore = Math.max(0, Math.min(100, legitimacyScore));
  
  let legitimacyStatus: LegitimacyStatus = "Safe";
  if (legitimacyScore < 50 || issues.length >= 3) {
    legitimacyStatus = "High Risk";
  } else if (legitimacyScore < 75 || issues.length >= 1) {
    legitimacyStatus = "Needs Review";
  }
  
  const legitimacy: LegitimacyQuality = {
    legitimacyScore,
    legitimacyStatus,
    dataQualityScore,
    issues,
    warnings,
    fieldsFound,
    fieldsTotal,
  };
  
  // ----- 6) Summary Sentence -----
  const totalDisplay = total !== "—" ? `${currency}${total}` : "unknown amount";
  let summaryReason = "";
  if (issues.length > 0) {
    summaryReason = issues.slice(0, 2).join("; ");
  } else if (warnings.length > 0) {
    summaryReason = warnings.slice(0, 2).join("; ");
  } else {
    summaryReason = `all key fields extracted (${fieldsFound}/${fieldsTotal}) and math checks out`;
  }
  
  const summarySentence = `Invoice from ${companyName} for ${totalDisplay} is marked ${legitimacyStatus}: ${summaryReason}.`;
  
  return {
    filename,
    sender,
    invoiceDetails,
    amounts,
    payment,
    legitimacy,
    summarySentence,
  };
}

// ============================================================================
// 3-LAYER EXTRACTION (normalize → template detect → extract + line items + meta)
// ============================================================================

function confidenceFor(
  value: string,
  templateMatched: boolean,
  isFromTable: boolean
): Confidence {
  if (isFromTable) return value ? "high" : "low";
  if (templateMatched && value && value !== "—" && value !== "Unknown") return "high";
  if (value && value !== "—" && value !== "Unknown") return "medium";
  return "low";
}

function methodFor(templateMatched: boolean, isFromTable: boolean): ExtractionMethod {
  if (isFromTable) return "table";
  return templateMatched ? "template" : "generic";
}

/**
 * Full pipeline: normalize PDF text (Layer A), detect vendor (Layer B), extract (existing),
 * add line items (Layer C), and attach confidence + method per field.
 */
export function extractFullInvoiceWithLayers(rawPdfText: string, filename: string = ""): InvoiceExtraction {
  const { text: normalizedText } = normalizePdfText(rawPdfText, false);
  const text = normalizedText || rawPdfText;
  const template = detectVendorTemplate(text);
  const templateMatched = template !== null;

  const extraction = extractFullInvoice(text, filename);

  const lineItems = extractLineItemsFromText(text);

  const fieldMeta: Record<string, FieldMeta> = {
    companyName: {
      confidence: confidenceFor(extraction.sender.companyName, templateMatched, false),
      method: methodFor(templateMatched, false),
    },
    companyRegistrationId: {
      confidence: confidenceFor(extraction.sender.companyRegistrationId, templateMatched, false),
      method: methodFor(templateMatched, false),
    },
    invoiceNumber: {
      confidence: confidenceFor(extraction.invoiceDetails.invoiceNumber, templateMatched, false),
      method: methodFor(templateMatched, false),
    },
    invoiceDate: {
      confidence: confidenceFor(extraction.invoiceDetails.invoiceDate, templateMatched, false),
      method: methodFor(templateMatched, false),
    },
    dueDate: {
      confidence: confidenceFor(extraction.invoiceDetails.dueDate, templateMatched, false),
      method: methodFor(templateMatched, false),
    },
    total: {
      confidence: confidenceFor(extraction.amounts.total, templateMatched, false),
      method: methodFor(templateMatched, false),
    },
    subtotal: {
      confidence: confidenceFor(extraction.amounts.subtotal, templateMatched, false),
      method: methodFor(templateMatched, false),
    },
    vatTaxAmount: {
      confidence: confidenceFor(extraction.amounts.vatTaxAmount, templateMatched, false),
      method: methodFor(templateMatched, false),
    },
    ibanOrAccount: {
      confidence: confidenceFor(extraction.payment.ibanOrAccount, templateMatched, false),
      method: methodFor(templateMatched, false),
    },
    beneficiaryName: {
      confidence: confidenceFor(extraction.payment.beneficiaryName, templateMatched, false),
      method: methodFor(templateMatched, false),
    },
  };

  const extractionMeta: ExtractionMeta = {
    vendorTemplateId: template?.id ?? null,
    vendorTemplateName: template?.name ?? null,
    fieldMeta,
    normalized: normalizedText.length > 0 && normalizedText !== rawPdfText,
  };

  return {
    ...extraction,
    lineItems: lineItems.length > 0 ? lineItems : undefined,
    extractionMeta,
  };
}

// ============================================================================
// LEGACY EXPORTS
// ============================================================================

export function extractionToRow(ex: InvoiceExtraction): InvoiceRow {
  return {
    vendor: ex.sender.companyName,
    date: ex.invoiceDetails.invoiceDate,
    total: ex.amounts.total,
    vat: ex.amounts.vatTaxAmount,
  };
}

export function extractInvoice(text: string, filename: string = ""): InvoiceRow {
  const full = extractFullInvoice(text, filename);
  return extractionToRow(full);
}
