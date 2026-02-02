# Backend (Optional)

**Note:** The app now uses Next.js API routes (`/api/extract`, `/api/export-excel`) so it works on Vercel without this Python backend.

This folder contains an alternative Python/FastAPI implementation if you prefer to run a separate backend server.

## Run (Optional)

```bash
cd backend
py -m pip install -r requirements.txt
py -m uvicorn main:app --reload
```

API: `http://localhost:8000`  
Docs: `http://localhost:8000/docs`

## Python Endpoints

- **POST /api/extract** — upload PDF(s), extract fields, return JSON
- **GET /api/invoices** — return all stored rows (in-memory)
- **GET /api/invoices/excel** — download as `.xlsx`
- **DELETE /api/invoices** — clear the list
