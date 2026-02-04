import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import type { InvoiceExtraction } from "@/lib/extract";

interface InvoiceRow {
  vendor: string;
  date: string;
  total: string;
  vat: string;
}

interface ExportBody {
  invoices: InvoiceRow[];
  extractions?: InvoiceExtraction[];
  filename?: string;
  currency?: string;
}

const headerFill: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1E3A5F" },
};
const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: "FFFFFFFF" } };
const border: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

function styleHeaderRow(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { horizontal: "center" };
    cell.border = border;
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ExportBody;
    const {
      invoices,
      extractions = [],
      filename = "invoices.xlsx",
      currency = "$",
    } = body;

    if (!invoices || !Array.isArray(invoices)) {
      return NextResponse.json({ error: "No invoice data" }, { status: 400 });
    }

    const workbook = new ExcelJS.Workbook();
    const totalSum = invoices.reduce((sum, inv) => {
      const val = parseFloat(String(inv.total).replace(/,/g, "")) || 0;
      return sum + val;
    }, 0);
    const vatSum = invoices.reduce((sum, inv) => {
      const val = parseFloat(String(inv.vat).replace(/,/g, "")) || 0;
      return sum + val;
    }, 0);
    const netSum = totalSum - vatSum;

    // --- Sheet 1: Full extraction (everything like the dashboard) - OPEN FIRST ---
    const hasExtractions = extractions && Array.isArray(extractions) && extractions.length > 0;
    if (hasExtractions) {
      const fullSheet = workbook.addWorksheet("Invoice data (full)", { first: true });
      const fullHeaders = [
        "#",
        "Filename",
        "Company name",
        "Company ID",
        "Address",
        "Country",
        "Invoice #",
        "Invoice date",
        "Due date",
        "Payment terms",
        "Subtotal",
        "VAT/Tax",
        "VAT %",
        "Total",
        "Currency",
        "Math OK",
        "Payment method",
        "Beneficiary",
        "IBAN/Account",
        "Bank country",
        "Consistent with sender",
        "Legitimacy %",
        "Status",
        "Data quality %",
        "Issues",
        "Summary",
      ];
      const fullHeaderRow = fullSheet.addRow(fullHeaders);
      styleHeaderRow(fullHeaderRow);

      const wrapAlignment: Partial<ExcelJS.Alignment> = { wrapText: true, vertical: "top" };
      extractions.forEach((ex, i) => {
        const row = fullSheet.addRow([
          i + 1,
          ex.filename || "",
          ex.sender.companyName,
          ex.sender.companyRegistrationId,
          ex.sender.address,
          ex.sender.country,
          ex.invoiceDetails.invoiceNumber,
          ex.invoiceDetails.invoiceDate,
          ex.invoiceDetails.dueDate,
          ex.invoiceDetails.paymentTerms,
          ex.amounts.subtotal,
          ex.amounts.vatTaxAmount,
          ex.amounts.vatTaxRate,
          ex.amounts.total,
          ex.amounts.currency,
          ex.amounts.mathValid ? "Yes" : "No",
          ex.payment.paymentMethod,
          ex.payment.beneficiaryName,
          ex.payment.ibanOrAccount,
          ex.payment.bankCountry,
          ex.payment.consistentWithSender ? "Yes" : "No",
          ex.legitimacy.legitimacyScore,
          ex.legitimacy.legitimacyStatus,
          ex.legitimacy.dataQualityScore,
          (ex.legitimacy.issues || []).join("; "),
          ex.summarySentence || "",
        ]);
        row.eachCell((c) => {
          c.border = border;
          c.alignment = wrapAlignment;
        });
        // Minimum height so wrapped text can show multiple lines (Excel may expand further when opened)
        row.height = 45;
      });
      fullSheet.getColumn(1).width = 6;
      fullSheet.getColumn(2).width = 28;
      fullSheet.getColumn(3).width = 24;
      fullSheet.getColumn(4).width = 16;
      fullSheet.getColumn(5).width = 28;
      fullSheet.getColumn(6).width = 14;
      fullSheet.getColumn(7).width = 14;
      fullSheet.getColumn(8).width = 14;
      fullSheet.getColumn(9).width = 14;
      fullSheet.getColumn(10).width = 16;
      fullSheet.getColumn(11).width = 12;
      fullSheet.getColumn(12).width = 12;
      fullSheet.getColumn(13).width = 10;
      fullSheet.getColumn(14).width = 12;
      fullSheet.getColumn(15).width = 10;
      fullSheet.getColumn(16).width = 8;
      fullSheet.getColumn(17).width = 14;
      fullSheet.getColumn(18).width = 22;
      fullSheet.getColumn(19).width = 22;
      fullSheet.getColumn(20).width = 14;
      fullSheet.getColumn(21).width = 12;
      fullSheet.getColumn(22).width = 12;
      fullSheet.getColumn(23).width = 12;
      fullSheet.getColumn(24).width = 14;
      fullSheet.getColumn(25).width = 36;
      fullSheet.getColumn(26).width = 50;
    } else {
      // Fallback: no full extraction data — still put a useful first sheet (vendor, date, total, VAT)
      const fallbackSheet = workbook.addWorksheet("Invoice data (full)", { first: true });
      const fallbackHeaders = ["#", "Vendor", "Date", "Total", "VAT", "Currency"];
      styleHeaderRow(fallbackSheet.addRow(fallbackHeaders));
      invoices.forEach((inv, i) => {
        const r = fallbackSheet.addRow([i + 1, inv.vendor, inv.date, inv.total, inv.vat, currency]);
        r.eachCell((c) => { c.border = border; });
      });
      fallbackSheet.getColumn(1).width = 6;
      fallbackSheet.getColumn(2).width = 30;
      fallbackSheet.getColumn(3).width = 14;
      fallbackSheet.getColumn(4).width = 14;
      fallbackSheet.getColumn(5).width = 14;
      fallbackSheet.getColumn(6).width = 10;
    }

    // --- Summary sheet (totals overview) ---
    const summarySheet = workbook.addWorksheet("Summary");
    summarySheet.addRow(["Invoice export summary"]);
    summarySheet.addRow(["All extracted fields are in the first sheet: Invoice data (full)."]);
    summarySheet.addRow([]);
    summarySheet.addRow(["Total rows", invoices.length]);
    summarySheet.addRow(["Grand total", `${currency}${totalSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`]);
    summarySheet.addRow(["Total VAT", `${currency}${vatSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`]);
    summarySheet.addRow(["Net amount", `${currency}${netSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`]);
    summarySheet.getColumn(1).width = 18;
    summarySheet.getColumn(2).width = 24;

    // --- Invoices (simple) sheet ---
    const sheet = workbook.addWorksheet("Invoices");
    const headers = ["#", "Vendor", "Date", "Total", "VAT"];
    const headerRow = sheet.addRow(headers);
    styleHeaderRow(headerRow);

    invoices.forEach((inv, i) => {
      const row = sheet.addRow([i + 1, inv.vendor, inv.date, inv.total, inv.vat]);
      row.eachCell((c) => {
        c.border = border;
      });
    });

    sheet.getColumn(1).width = 6;
    sheet.getColumn(2).width = 30;
    sheet.getColumn(3).width = 14;
    sheet.getColumn(4).width = 14;
    sheet.getColumn(5).width = 14;

    if (invoices.length > 0) {
      sheet.addRow([]);
      const summaryRow = sheet.addRow([
        "",
        "",
        "Totals:",
        totalSum.toLocaleString("en-US", { minimumFractionDigits: 2 }),
        vatSum.toLocaleString("en-US", { minimumFractionDigits: 2 }),
      ]);
      summaryRow.getCell(3).font = { bold: true };
      summaryRow.getCell(4).font = { bold: true };
      summaryRow.getCell(5).font = { bold: true };
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const finalName = safeName.endsWith(".xlsx") ? safeName : `${safeName}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${finalName}"`,
      },
    });
  } catch (error) {
    console.error("Excel export error:", error);
    return NextResponse.json({ error: "Failed to generate Excel" }, { status: 500 });
  }
}
