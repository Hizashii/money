"""
Standalone script to test AI invoice extraction.
Usage: set GEMINI_API_KEY in the environment, then from repo root:
  python -m backend.ai_extract  (or run this file with backend on PYTHONPATH)

Or run this script (from repo root) to extract from invoice.pdf:
  python src/app/api/ai/ai.py
"""
import os
import sys

# Allow importing backend when run from repo root
_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)

from backend.ai_extract import extract_invoice_ai

if __name__ == "__main__":
    pdf_path = os.environ.get("INVOICE_PDF", "invoice.pdf")
    if not os.path.isfile(pdf_path):
        print("Set INVOICE_PDF or place invoice.pdf in the current directory.", file=sys.stderr)
        sys.exit(1)
    with open(pdf_path, "rb") as f:
        data = f.read()
    result = extract_invoice_ai(data, os.path.basename(pdf_path))
    if result is None:
        print("Extraction failed. Ensure GEMINI_API_KEY is set.", file=sys.stderr)
        sys.exit(1)
    print(result)
