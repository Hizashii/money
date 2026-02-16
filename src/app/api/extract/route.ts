import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";
import { extractFullInvoiceWithLayers, type InvoiceExtraction } from "@/lib/extract";
import { MAX_FILE_SIZE_BYTES } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded. Please select at least one PDF." },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json(
          { error: `"${file.name}" is not a PDF. Please upload PDF files only.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `"${file.name}" is too large. Maximum size is 10 MB per file.` },
          { status: 400 }
        );
      }
    }

    const extractions: InvoiceExtraction[] = [];

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      let text = "";

      try {
        const { text: extractedText } = await extractText(buffer);
        text = Array.isArray(extractedText) ? extractedText.join("\n") : (extractedText || "");
      } catch (e) {
        console.error("PDF parse error:", e);
        text = "";
      }

      const extraction = extractFullInvoiceWithLayers(text, file.name);
      extractions.push(extraction);
    }

    const currency = extractions[0]?.amounts.currency ?? "$";
    const summarySentence =
      extractions.length === 1
        ? extractions[0].summarySentence
        : `${extractions.length} invoices extracted. Review each for legitimacy and totals.`;

    return NextResponse.json({
      extractions,
      currency,
      summarySentence,
    });
  } catch (error) {
    console.error("Extract error:", error);
    return NextResponse.json(
      {
        error:
          "Could not process your PDF. Try a text-based invoice (not a scanned image). If the file is large, try a smaller one.",
      },
      { status: 500 }
    );
  }
}
