/**
 * Full invoice extraction from PDF text: sender, details, amounts, payment,
 * legitimacy/quality scores, issues, and one-sentence summary.
 */

export interface SenderIdentity {
  companyName: string;
  companyRegistrationId: string;
  address: string;
  country: string;
  companyLogoUrl: string; // empty when not extracted (image)
}

export interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
}

export interface Amounts {
  subtotal: string;
  vatTaxAmount: string;
  vatTaxRate: string;
  total: string;
  currency: string;
  mathValid: boolean;
  mathNote: string;
}

export interface PaymentDestination {
  paymentMethod: string;
  beneficiaryName: string;
  ibanOrAccount: string;
  bankCountry: string;
  consistentWithSender: boolean;
  consistencyNote: string;
}

export type LegitimacyStatus = "Safe" | "Needs Review" | "High Risk";

export interface LegitimacyQuality {
  legitimacyScore: number;
  legitimacyStatus: LegitimacyStatus;
  dataQualityScore: number;
  issues: string[];
}

export interface InvoiceExtraction {
  filename: string;
  sender: SenderIdentity;
  invoiceDetails: InvoiceDetails;
  amounts: Amounts;
  payment: PaymentDestination;
  legitimacy: LegitimacyQuality;
  summarySentence: string;
}

/** Legacy flat row for backward compatibility / table export */
export interface InvoiceRow {
  vendor: string;
  date: string;
  total: string;
  vat: string;
}

/** Detect currency symbol/code from invoice text */
export function detectCurrency(text: string): string {
  if (!text) return "$";
  if (/€|EUR|euro/i.test(text)) return "€";
  if (/£|GBP|pound/i.test(text)) return "£";
  if (/\$|USD|dollar/i.test(text)) return "$";
  return "$";
}

function normalizeNumber(s: string): number {
  if (!s || s === "—") return 0;
  const n = parseFloat(String(s).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

/** Full extraction from raw PDF text */
export function extractFullInvoice(text: string, filename: string = ""): InvoiceExtraction {
  const currency = detectCurrency(text);

  // ----- 1) Sender Identity -----
  let companyName = "Unknown";
  for (const pattern of [
    /(?:From|Bill from|Invoice from|Vendor|Seller|Issued by)\s*[:\s]*\n?\s*([A-Za-z0-9\s&.,\-'()]+?)(?:\n|$)/i,
    /(?:Company name|Company)\s*[:\s]*\n?\s*([A-Za-z0-9\s&.,\-'()]+?)(?:\n|$)/i,
    /^([A-Z][A-Za-z0-9\s&.,\-'()]{2,50})\s*$/m,
  ]) {
    const m = text.match(pattern);
    if (m) {
      companyName = m[1].trim().slice(0, 80);
      break;
    }
  }
  if (companyName === "Unknown") {
    const first = text.trim().split("\n")[0]?.trim();
    if (first && first.length > 2) companyName = first.slice(0, 80);
  }

  let companyRegistrationId = "—";
  for (const pattern of [
    /(?:CVR|VAT|Company (?:reg\.?|registration)?\s*ID|Org\.?\s*no\.?|Registration)\s*[:\s#]*\s*([A-Z0-9\s\-]+?)(?:\n|$)/i,
    /(?:VAT\s*number|VAT\s*ID)\s*[:\s]*\s*([A-Z0-9\s\-]+?)(?:\n|$)/i,
    /(?:Tax\s*ID|Tax\s*number)\s*[:\s]*\s*([A-Z0-9\s\-]+?)(?:\n|$)/i,
  ]) {
    const m = text.match(pattern);
    if (m) {
      companyRegistrationId = m[1].trim().slice(0, 40);
      break;
    }
  }

  let address = "—";
  const addressPatterns = [
    /(?:Address|Company address|Registered address)\s*[:\s]*\n([^\n]+(?:\n[^\n]+){0,3}?)(?=\n[A-Z]|\n\d|$)/i,
    /([A-Za-z0-9\s,.\-]+)\n(\d{1,6}[\s\-]?[A-Za-z]?\s+[A-Za-z\s\-]+(?:\n[A-Za-z0-9\s,.\-]+)?)/m,
  ];
  for (const pattern of addressPatterns) {
    const m = text.match(pattern);
    if (m) {
      address = (m[1] + (m[2] ? "\n" + m[2] : "")).replace(/\n+/g, ", ").trim().slice(0, 120);
      if (address.length > 5) break;
    }
  }

  let country = "—";
  const countryPattern = /(?:Country|Land)\s*[:\s]*\s*([A-Za-z\s]+?)(?:\n|$)/i;
  const countryMatch = text.match(countryPattern);
  if (countryMatch) country = countryMatch[1].trim().slice(0, 40);
  if (country === "—" && /\b(DK|Denmark|DE|Germany|UK|United Kingdom|US|USA|France|FR|NL|Netherlands)\b/i.test(text)) {
    const c = text.match(/\b(DK|Denmark|DE|Germany|UK|United Kingdom|US|USA|France|FR|NL|Netherlands)\b/i);
    if (c) country = c[1];
  }

  const sender: SenderIdentity = {
    companyName,
    companyRegistrationId,
    address,
    country,
    companyLogoUrl: "", // text-only extraction; logo would require image extraction
  };

  // ----- 2) Invoice Details -----
  let invoiceNumber = "—";
  for (const pattern of [
    /(?:Invoice\s*(?:number|no\.?|#)|Invoice\s*ID)\s*[:\s#]*\s*([A-Z0-9\-/]+?)(?:\n|$)/i,
    /(?:No\.?|Number)\s*[:\s]*\s*([A-Z0-9\-/]+?)(?:\n|$)/i,
  ]) {
    const m = text.match(pattern);
    if (m) {
      invoiceNumber = m[1].trim().slice(0, 40);
      break;
    }
  }

  let invoiceDate = "—";
  for (const pattern of [
    /(?:Invoice\s*date|Date\s*of\s*invoice|Issue\s*date)\s*[:\s]*(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/i,
    /(?:Date)\s*[:\s]*(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/i,
    /(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/,
    /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i,
  ]) {
    const m = text.match(pattern);
    if (m) {
      invoiceDate = m[1].trim();
      break;
    }
  }

  let dueDate = "—";
  for (const pattern of [
    /(?:Due\s*date|Payment\s*due|Due)\s*[:\s]*(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/i,
    /(?:Due)\s*[:\s]*(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i,
  ]) {
    const m = text.match(pattern);
    if (m) {
      dueDate = m[1].trim();
      break;
    }
  }

  let paymentTerms = "—";
  for (const pattern of [
    /(?:Payment\s*terms|Terms)\s*[:\s]*\s*(Net\s*\d+|Due\s*(?:on|within)\s*receipt|\d+\s*days?|[\w\s,]+?)(?:\n|$)/i,
    /(Net\s*\d+)/i,
    /(\d+\s*days?\s*(?:net|from\s*invoice)?)/i,
  ]) {
    const m = text.match(pattern);
    if (m) {
      paymentTerms = m[1].trim().slice(0, 60);
      break;
    }
  }

  const invoiceDetails: InvoiceDetails = {
    invoiceNumber,
    invoiceDate,
    dueDate,
    paymentTerms,
  };

  // ----- 3) Amounts -----
  let subtotal = "—";
  for (const pattern of [
    /(?:Subtotal|Sub\s*total|Net\s*amount|Net)\s*[:\s]*[\$€£]?\s*([\d,]+\.?\d*)/i,
    /(?:Total\s*before\s*tax|Amount\s*before\s*VAT)\s*[:\s]*[\$€£]?\s*([\d,]+\.?\d*)/i,
  ]) {
    const m = text.match(pattern);
    if (m) {
      subtotal = m[1].trim();
      break;
    }
  }

  let vatTaxAmount = "—";
  let vatTaxRate = "—";
  for (const pattern of [
    /(?:VAT|Tax|GST)\s*[:\s]*[\$€£]?\s*([\d,]+\.?\d*)/i,
    /(?:VAT|Tax)\s*[:\s]*(\d+(?:\.\d+)?\s*%)/i,
  ]) {
    const m = text.match(pattern);
    if (m) {
      if (m[1].includes("%")) vatTaxRate = m[1].trim();
      else vatTaxAmount = m[1].trim();
    }
  }
  if (vatTaxRate === "—") {
    const rateM = text.match(/(\d+(?:\.\d+)?)\s*%\s*(?:VAT|tax)/i) ?? text.match(/(?:VAT|Tax)\s*@\s*(\d+(?:\.\d+)?)\s*%/i);
    if (rateM) vatTaxRate = rateM[1] + "%";
  }

  let total = "—";
  for (const pattern of [
    /(?:Total|Amount due|Grand total|Total due)\s*[:\s]*[\$€£]?\s*([\d,]+\.?\d*)/i,
    /[\$€£]\s*([\d,]+\.?\d{2})\s*(?:USD|EUR|GBP)?\s*$/m,
    /([\d,]+\.?\d{2})\s*(?:USD|EUR|GBP)/,
  ]) {
    const m = text.match(pattern);
    if (m) {
      total = m[1].trim();
      break;
    }
  }

  const subNum = normalizeNumber(subtotal);
  const vatNum = normalizeNumber(vatTaxAmount);
  const totalNum = normalizeNumber(total);
  const expectedTotal = subNum + vatNum;
  const tolerance = 0.02;
  const mathValid = totalNum <= 0 || Math.abs(totalNum - expectedTotal) <= tolerance || (subNum <= 0 && vatNum <= 0);
  let mathNote = "";
  if (totalNum > 0 && (subNum > 0 || vatNum > 0) && !mathValid) {
    mathNote = `Total (${totalNum.toFixed(2)}) does not match Subtotal (${subNum.toFixed(2)}) + Tax (${vatNum.toFixed(2)}) = ${expectedTotal.toFixed(2)}`;
  } else if (mathValid && totalNum > 0) {
    mathNote = "Totals match.";
  }

  const amounts: Amounts = {
    subtotal: subtotal !== "—" ? subtotal : (subNum > 0 ? String(subNum) : "—"),
    vatTaxAmount,
    vatTaxRate,
    total,
    currency,
    mathValid,
    mathNote,
  };

  // ----- 4) Payment Destination -----
  let paymentMethod = "—";
  if (/\b(bank\s*transfer|wire|IBAN|SWIFT|BIC)\b/i.test(text)) paymentMethod = "Bank transfer";
  else if (/\b(card|credit|debit|payment\s*card)\b/i.test(text)) paymentMethod = "Card";
  else if (/\b(paypal|mobile\s*pay)\b/i.test(text)) paymentMethod = text.match(/\b(paypal|mobile\s*pay)\b/i)?.[1] ?? "—";
  if (paymentMethod === "—") paymentMethod = "Not specified";

  let beneficiaryName = "—";
  for (const pattern of [
    /(?:Beneficiary|Pay\s*to|Account\s*name|Name\s*on\s*account)\s*[:\s]*\n?\s*([A-Za-z0-9\s&.,\-'()]+?)(?:\n|$)/i,
    /(?:Transfer\s*to|Payable\s*to)\s*[:\s]*\n?\s*([A-Za-z0-9\s&.,\-'()]+?)(?:\n|$)/i,
  ]) {
    const m = text.match(pattern);
    if (m) {
      beneficiaryName = m[1].trim().slice(0, 80);
      break;
    }
  }

  let ibanOrAccount = "—";
  const ibanMatch = text.match(/\b([A-Z]{2}\d{2}\s?(?:[A-Z0-9]\s?){4,})\b/);
  if (ibanMatch) ibanOrAccount = ibanMatch[1].replace(/\s/g, "").slice(0, 40);
  if (ibanOrAccount === "—") {
    const accMatch = text.match(/(?:Account\s*number|Account\s*no\.?|Bank\s*account)\s*[:\s]*\s*([A-Z0-9\s\-]+?)(?:\n|$)/i);
    if (accMatch) ibanOrAccount = accMatch[1].trim().slice(0, 40);
  }

  let bankCountry = "—";
  const bankCountryMatch = text.match(/(?:Bank\s*country|Country\s*of\s*bank)\s*[:\s]*\s*([A-Za-z\s]+?)(?:\n|$)/i);
  if (bankCountryMatch) bankCountry = bankCountryMatch[1].trim().slice(0, 40);
  if (ibanOrAccount !== "—" && ibanOrAccount.slice(0, 2).match(/^[A-Z]{2}$/)) {
    const code = ibanOrAccount.slice(0, 2).toUpperCase();
    const map: Record<string, string> = { DK: "Denmark", DE: "Germany", GB: "United Kingdom", NL: "Netherlands", FR: "France", US: "USA" };
    if (map[code]) bankCountry = map[code];
  }

  const beneficiaryLower = beneficiaryName.toLowerCase();
  const companyLower = companyName.toLowerCase();
  const nameOverlap = companyLower.split(/\s+/).some((w) => w.length > 2 && beneficiaryLower.includes(w));
  const consistentWithSender = beneficiaryName === "—" || companyName === "Unknown" || nameOverlap || beneficiaryLower.includes(companyLower) || companyLower.includes(beneficiaryLower);
  let consistencyNote = consistentWithSender ? "Payment recipient appears to match sender." : "Beneficiary name does not clearly match invoice sender—verify before paying.";

  const payment: PaymentDestination = {
    paymentMethod,
    beneficiaryName,
    ibanOrAccount,
    bankCountry,
    consistentWithSender,
    consistencyNote,
  };

  // ----- 5) Legitimacy & Quality -----
  const issues: string[] = [];
  if (invoiceNumber === "—") issues.push("Missing invoice number");
  if (companyRegistrationId === "—") issues.push("Missing company registration / CVR / VAT ID");
  if (!mathValid && totalNum > 0) issues.push("Totals don't add up");
  if (vatNum > 0 && totalNum > 0 && vatNum / totalNum > 0.5) issues.push("VAT unusually high (>50% of total)");
  if (!payment.consistentWithSender && beneficiaryName !== "—") issues.push("Bank/beneficiary mismatch with sender");
  if (text.length < 100) issues.push("Low text quality or very short document");
  if (total === "—" || totalNum <= 0) issues.push("Missing or invalid total amount");
  if (invoiceDate === "—") issues.push("Missing invoice date");

  const issueCount = issues.length;
  const dataQualityScore = Math.max(0, 100 - issueCount * 12 - (companyRegistrationId === "—" ? 10 : 0) - (invoiceNumber === "—" ? 10 : 0));
  let legitimacyScore = dataQualityScore;
  if (!mathValid) legitimacyScore -= 15;
  if (!payment.consistentWithSender && beneficiaryName !== "—") legitimacyScore -= 20;
  if (vatNum / totalNum > 0.5 && totalNum > 0) legitimacyScore -= 10;
  legitimacyScore = Math.max(0, Math.min(100, legitimacyScore));

  let legitimacyStatus: LegitimacyStatus = "Safe";
  if (legitimacyScore < 50) legitimacyStatus = "High Risk";
  else if (legitimacyScore < 75 || issues.length > 2) legitimacyStatus = "Needs Review";

  const legitimacy: LegitimacyQuality = {
    legitimacyScore,
    legitimacyStatus,
    dataQualityScore,
    issues,
  };

  // ----- 6) One-sentence summary -----
  const totalDisplay = total !== "—" ? `${currency}${total}` : "unknown amount";
  const summarySentence = `This invoice from ${companyName} for ${totalDisplay} appears ${legitimacyStatus} because ${issues.length > 0 ? issues.slice(0, 2).join("; ") : "key fields were extracted and math checks out."}`;

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

/** Legacy: produce a single flat row from a full extraction (for table/export). */
export function extractionToRow(ex: InvoiceExtraction): InvoiceRow {
  return {
    vendor: ex.sender.companyName,
    date: ex.invoiceDetails.invoiceDate,
    total: ex.amounts.total,
    vat: ex.amounts.vatTaxAmount,
  };
}

/** Legacy: extract only vendor, date, total, VAT from text (for backward compatibility). */
export function extractInvoice(text: string, filename: string = ""): InvoiceRow {
  const full = extractFullInvoice(text, filename);
  return extractionToRow(full);
}
