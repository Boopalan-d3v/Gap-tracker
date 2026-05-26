"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, ChevronDown } from "lucide-react";

function toCSV(records) {
  const headers = [
    "Device Name",
    "Jurisdiction",
    "Status",
    "Clearance Number",
    "Expiry Date",
    "Last Checked",
    "Match Method",
    "Review Note",
    "Reviewed By",
    "Reviewed At",
  ];

  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const rows = records.map((r) => [
    r.deviceName,
    r.jurisdiction,
    r.status,
    r.clearanceNumber ?? "",
    r.expiryDate ?? "",
    r.lastChecked ? new Date(r.lastChecked).toLocaleString() : "",
    r.matchMethod,
    r.reviewNote ?? "",
    r.reviewedBy ?? "",
    r.reviewedAt ? new Date(r.reviewedAt).toLocaleString() : "",
  ]);

  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportExcel(records) {
  // Dynamic import so exceljs is only loaded on demand
  const ExcelJS = (await import("exceljs")).default ?? (await import("exceljs"));

  const wb = new ExcelJS.Workbook();
  wb.creator = "RP360 Submission Gap Tracker";
  wb.created = new Date();

  const ws = wb.addWorksheet("Submission Gap Tracker");

  ws.columns = [
    { header: "Device Name",      key: "deviceName",      width: 24 },
    { header: "Jurisdiction",     key: "jurisdiction",    width: 16 },
    { header: "Status",           key: "status",          width: 16 },
    { header: "Clearance Number", key: "clearanceNumber", width: 20 },
    { header: "Expiry Date",      key: "expiryDate",      width: 14 },
    { header: "Last Checked",     key: "lastChecked",     width: 22 },
    { header: "Match Method",     key: "matchMethod",     width: 16 },
    { header: "Review Note",      key: "reviewNote",      width: 42 },
    { header: "Reviewed By",      key: "reviewedBy",      width: 18 },
    { header: "Reviewed At",      key: "reviewedAt",      width: 22 },
  ];

  // Style header row
  ws.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0D1728" } };
    cell.alignment = { vertical: "middle" };
  });
  ws.getRow(1).height = 20;

  // Status fill colours
  const STATUS_FILL = {
    gap_detected:  "FFFF6B88",
    expiring_soon: "FFF3C969",
    active:        "FF1FC1B2",
    reviewed:      "FF58A6FF",
  };

  records.forEach((r) => {
    const row = ws.addRow({
      deviceName:      r.deviceName,
      jurisdiction:    r.jurisdiction,
      status:          r.status,
      clearanceNumber: r.clearanceNumber ?? "",
      expiryDate:      r.expiryDate ?? "",
      lastChecked:     r.lastChecked ? new Date(r.lastChecked).toLocaleString() : "",
      matchMethod:     r.matchMethod === "exact_number" ? "Exact Number" : "Name Match",
      reviewNote:      r.reviewNote ?? "",
      reviewedBy:      r.reviewedBy ?? "",
      reviewedAt:      r.reviewedAt ? new Date(r.reviewedAt).toLocaleString() : "",
    });

    const argb = STATUS_FILL[r.status];
    if (argb) {
      const statusCell = row.getCell("status");
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb } };
      statusCell.font = { color: { argb: "FF08111F" }, bold: true };
    }
  });

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const filename = `rp360-submission-gaps-${new Date().toISOString().split("T")[0]}.xlsx`;
  downloadBlob(blob, filename);
}

export function ExportButton({ records }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null); // "csv" | "excel" | null

  async function handleCSV() {
    setLoading("csv");
    setOpen(false);
    try {
      const csv = toCSV(records);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const filename = `rp360-submission-gaps-${new Date().toISOString().split("T")[0]}.csv`;
      downloadBlob(blob, filename);
    } finally {
      setLoading(null);
    }
  }

  async function handleExcel() {
    setLoading("excel");
    setOpen(false);
    try {
      await exportExcel(records);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={!!loading}
        className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm
          font-medium text-slate-600 hover:border-blue/60 hover:text-blue transition
          disabled:opacity-50 disabled:cursor-wait"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Export
        <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 z-20 w-44 rounded-xl border border-line bg-panel shadow-panel fade-in">
            <button
              onClick={handleCSV}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-600
                hover:bg-slate-50 hover:text-slate-900 transition rounded-t-xl"
            >
              <FileText className="h-4 w-4 text-teal" />
              Export as CSV
            </button>
            <div className="border-t border-line" />
            <button
              onClick={handleExcel}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-600
                hover:bg-slate-50 hover:text-slate-900 transition rounded-b-xl"
            >
              <FileSpreadsheet className="h-4 w-4 text-mint" />
              Export as Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
