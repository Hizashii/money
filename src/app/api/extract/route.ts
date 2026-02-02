import { NextRequest, NextResponse } from "next/server";
// @ts-expect-error - pdf-parse has no types
import pdf from "pdf-parse";
import { extractInvoice, type InvoiceRow } from "@/lib/extract";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const results: InvoiceRow[] = [];

    for (const file of files) {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      let text = "";

      try {
        const data = await pdf(buffer);
        text = data.text || "";
      } catch {
        text = "";
      }

      const row = extractInvoice(text, file.name);
      results.push(row);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Extract error:", error);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
