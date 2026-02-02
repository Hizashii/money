import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";
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

      const buffer = await file.arrayBuffer();
      let text = "";

      try {
        const { text: extractedText } = await extractText(buffer);
        text = Array.isArray(extractedText) ? extractedText.join("\n") : (extractedText || "");
      } catch (e) {
        console.error("PDF parse error:", e);
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
