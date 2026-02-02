import re
from dataclasses import dataclass


@dataclass
class InvoiceRow:
    vendor: str
    date: str
    total: str
    vat: str


def extract_invoice(text: str, filename: str = "") -> InvoiceRow:
    """Parse raw PDF text into vendor, date, total, VAT."""
    if not text or not text.strip():
        return InvoiceRow(
            vendor=filename or "Unknown",
            date="—",
            total="—",
            vat="—",
        )

    # Vendor: often first non-empty line or after "From"/"Bill to"/"Invoice from"
    vendor = "Unknown"
    for pattern in [
        r"(?:From|Bill to|Invoice from|Vendor)\s*[:\s]*\n?\s*([A-Za-z0-9\s&.,\-]+?)(?:\n|$)",
        r"^([A-Z][A-Za-z0-9\s&.,\-]{2,40})\s*$",
    ]:
        m = re.search(pattern, text, re.MULTILINE | re.IGNORECASE)
        if m:
            vendor = m.group(1).strip()[:60]
            break
    if vendor == "Unknown":
        first_line = text.strip().split("\n")[0].strip()
        if len(first_line) > 2 and first_line.isprintable():
            vendor = first_line[:60]

    # Date: common formats
    date = "—"
    for pattern in [
        r"(?:Date|Invoice date)\s*[:\s]*(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})",
        r"(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})",
        r"(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})",
    ]:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            date = m.group(1).strip()
            break

    # Total / amount due
    total = "—"
    for pattern in [
        r"(?:Total|Amount due|Grand total)\s*[:\s]*[\$€£]?\s*([\d,]+\.?\d*)",
        r"[\$€£]\s*([\d,]+\.?\d{2})\s*(?:USD|EUR|GBP)?\s*$",
        r"([\d,]+\.?\d{2})\s*(?:USD|EUR|GBP)",
    ]:
        m = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
        if m:
            total = m.group(1).strip()
            break

    # VAT
    vat = "—"
    for pattern in [
        r"(?:VAT|Tax|GST)\s*[:\s]*[\$€£]?\s*([\d,]+\.?\d*)",
        r"(?:VAT|Tax)\s*[:\s]*(\d+(?:\.\d+)?\s*%)",
    ]:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            vat = m.group(1).strip()
            break

    return InvoiceRow(vendor=vendor, date=date, total=total, vat=vat)
