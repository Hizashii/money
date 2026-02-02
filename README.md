# Money — Invoice to Spreadsheet (AI Extraction)

A lightweight dashboard that lets you upload PDF invoices, extracts key fields (vendor, date, total, VAT), displays them in a structured table, and exports everything to an Excel file.

- **Frontend:** Next.js (App Router) + Tailwind
- **Backend:** FastAPI (PDF text extraction + simple parsing) + Excel export (openpyxl)

> Note: Current extraction uses PDF text extraction (`pdfplumber`). Scanned/image-only invoices may return empty fields until OCR is added.

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

