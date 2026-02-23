# Money — Invoice to Spreadsheet (AI Extraction)

A lightweight dashboard that lets you upload PDF invoices, extracts key fields (vendor, date, total, VAT), displays them in a structured table, and exports everything to an Excel file.

- **Frontend:** Next.js (App Router) + Tailwind
- **Backend:** FastAPI (PDF text extraction + simple parsing) + Excel export (openpyxl)

> Note: Extraction tries **AI (Gemini) first** when `GEMINI_API_KEY` is set; otherwise it falls back to regex/text extraction. Scanned/image-only invoices work better with AI.

### Optional: AI extraction (Gemini)

Set `GEMINI_API_KEY` in your environment (e.g. in `.env.local` for Next.js) to use Gemini for invoice extraction. If unset or on errors, the app falls back to regex extraction.

---

## Features

- Upload one or multiple `.pdf` invoices
- Extract invoice fields:
  - Vendor
  - Date
  - Total
  - VAT / Tax
- View extracted invoices in a dashboard table
- Export extracted data as **Excel (.xlsx)**

---

## Project Structure (typical)

