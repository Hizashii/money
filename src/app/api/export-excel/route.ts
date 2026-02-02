import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

interface InvoiceRow {
  vendor: string;
  date: string;
  total: string;
  vat: string;
}

export async function POST(request: NextRequest) {
  try {
    const { invoices } = (await request.json()) as { invoices: InvoiceRow[] };

    if (!invoices || !Array.isArray(invoices)) {
      return NextResponse.json({ error: "No invoice data" }, { status: 400 });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Invoices");

    // Header style
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

    // Headers
    const headers = ["#", "Vendor", "Date", "Total", "VAT"];
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { horizontal: "center" };
      cell.border = border;
    });

    // Data rows
    invoices.forEach((inv, i) => {
      const row = sheet.addRow([i + 1, inv.vendor, inv.date, inv.total, inv.vat]);
      row.eachCell((cell) => {
        cell.border = border;
      });
    });

    // Column widths
    sheet.getColumn(1).width = 6;
    sheet.getColumn(2).width = 30;
    sheet.getColumn(3).width = 14;
    sheet.getColumn(4).width = 14;
    sheet.getColumn(5).width = 14;

    // Summary row
    if (invoices.length > 0) {
      sheet.addRow([]);
      const totalSum = invoices.reduce((sum, inv) => {
        const val = parseFloat(inv.total.replace(/,/g, "")) || 0;
        return sum + val;
      }, 0);
      const vatSum = invoices.reduce((sum, inv) => {
        const val = parseFloat(inv.vat.replace(/,/g, "")) || 0;
        return sum + val;
      }, 0);

      const summaryRow = sheet.addRow(["", "", "Totals:", totalSum.toLocaleString("en-US", { minimumFractionDigits: 2 }), vatSum.toLocaleString("en-US", { minimumFractionDigits: 2 })]);
      summaryRow.getCell(3).font = { bold: true };
      summaryRow.getCell(4).font = { bold: true };
      summaryRow.getCell(5).font = { bold: true };
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=invoices.xlsx",
      },
    });
  } catch (error) {
    console.error("Excel export error:", error);
    return NextResponse.json({ error: "Failed to generate Excel" }, { status: 500 });
  }
}
