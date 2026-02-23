"""
AI-powered invoice extraction using Gemini.
Callable module: use extract_invoice_ai(pdf_bytes, filename) -> dict | None.
Set GEMINI_API_KEY in the environment.
"""

import os
import json
import re

try:
    import google.generativeai as genai
except ImportError:
    genai = None

_EXTRACT_PROMPT = """Extract the following fields from this invoice and return as JSON only. Use "—" for missing values.
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

Return only the JSON object, nothing else."""


def _parse_json_from_response(text: str) -> dict | None:
    if not text or not text.strip():
        return None
    raw = text.strip()
    json_str = raw
    code_block = re.search(r"```(?:json)?\s*([\s\S]*?)```", raw)
    if code_block:
        json_str = code_block.group(1).strip()
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        return None


def extract_invoice_ai(pdf_bytes: bytes, filename: str = "invoice.pdf") -> dict | None:
    """
    Extract invoice data from PDF bytes using Gemini.
    Returns a dict with vendor_name, vendor_cvr, invoice_number, issue_date, due_date,
    line_items, subtotal, vat_amount, total, currency, iban, etc., or None on failure.
    """
    if genai is None:
        return None
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key or not api_key.strip():
        return None
    try:
        genai.configure(api_key=api_key.strip())
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            [
                {"mime_type": "application/pdf", "data": pdf_bytes},
                _EXTRACT_PROMPT,
            ]
        )
        text = response.text if response and hasattr(response, "text") else None
        if not text:
            return None
        return _parse_json_from_response(text)
    except Exception:
        return None
