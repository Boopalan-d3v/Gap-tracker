"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsUpDown, ExternalLink } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { STATUS_ORDER } from "../lib/mock-data";

const PAGE_SIZE = 10;

const COLUMNS = [
  { key: "deviceName",      label: "Device",        sortable: true  },
  { key: "jurisdiction",    label: "Jurisdiction",  sortable: true  },
  { key: "status",          label: "Status",        sortable: true  },
  { key: "clearanceNumber", label: "Clearance #",   sortable: false },
  { key: "expiryDate",      label: "Expiry Date",   sortable: true  },
  { key: "lastChecked",     label: "Last Checked",  sortable: true  },
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function daysUntil(iso) {
  if (!iso) return null;
  return Math.ceil((new Date(iso) - Date.now()) / (1000 * 60 * 60 * 24));
}

export function SubmissionTable({ records, onRowClick }) {
  const [sortKey, setSortKey] = useState("status");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever records change (filter applied)
  useEffect(() => { setPage(1); }, [records]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  const sorted = [...records].sort((a, b) => {
    let aVal, bVal;
    if (sortKey === "status") {
      aVal = STATUS_ORDER[a.status] ?? 99;
      bVal = STATUS_ORDER[b.status] ?? 99;
    } else if (sortKey === "expiryDate" || sortKey === "lastChecked") {
      aVal = a[sortKey] ? new Date(a[sortKey]).getTime() : Infinity;
      bVal = b[sortKey] ? new Date(b[sortKey]).getTime() : Infinity;
    } else {
      aVal = (a[sortKey] ?? "").toString().toLowerCase();
      bVal = (b[sortKey] ?? "").toString().toLowerCase();
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages  = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged       = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from        = sorted.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to          = Math.min(currentPage * PAGE_SIZE, sorted.length);

  // Build page number list with ellipsis
  function pageNumbers() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "…", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages);
    }
    return pages;
  }

  function SortIcon({ col }) {
    if (!col.sortable) return null;
    if (sortKey !== col.key)
      return <ChevronsUpDown className="ml-1.5 h-3 w-3 text-slate-300 flex-shrink-0" />;
    return sortDir === "asc"
      ? <ChevronUp   className="ml-1.5 h-3 w-3 text-blue flex-shrink-0" />
      : <ChevronDown className="ml-1.5 h-3 w-3 text-blue flex-shrink-0" />;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-slate-50/80">
              <th className="w-10 px-4 py-3 text-center text-xs font-semibold text-slate-400">#</th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider
                    ${sortKey === col.key ? "text-blue" : "text-slate-500"}
                    ${col.sortable ? "cursor-pointer select-none hover:text-slate-700" : ""}`}
                >
                  <div className="flex items-center">
                    {col.label}
                    <SortIcon col={col} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paged.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 2} className="px-4 py-16 text-center">
                  <p className="text-sm font-medium text-slate-500">No records match the current filters.</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
                </td>
              </tr>
            )}
            {paged.map((rec, idx) => {
              const days    = daysUntil(rec.expiryDate);
              const rowNum  = from + idx;

              return (
                <tr
                  key={rec.id}
                  onClick={() => onRowClick(rec)}
                  className="group cursor-pointer transition-colors hover:bg-blue/[0.03]"
                >
                  {/* Row number */}
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-[11px] text-slate-300 font-mono group-hover:text-slate-400 transition">
                      {rowNum}
                    </span>
                  </td>

                  {/* Device Name */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-semibold text-slate-800 text-sm group-hover:text-blue transition">
                      {rec.deviceName}
                    </span>
                  </td>

                  {/* Jurisdiction */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5
                      text-xs text-slate-600 font-mono tracking-wide">
                      {rec.jurisdiction}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={rec.status} />
                  </td>

                  {/* Clearance Number */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {rec.clearanceNumber
                      ? <span className="font-mono text-xs text-slate-500">{rec.clearanceNumber}</span>
                      : <span className="text-[11px] italic text-rose/60">Not registered</span>
                    }
                  </td>

                  {/* Expiry Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {rec.expiryDate ? (
                      <div className="flex items-center gap-2">
                        <span className={
                          days !== null && days <= 30  ? "text-rose font-semibold text-xs"  :
                          days !== null && days <= 90  ? "text-gold font-semibold text-xs"  :
                          "text-slate-700 text-xs"
                        }>
                          {formatDate(rec.expiryDate)}
                        </span>
                        {days !== null && (
                          <span className={`text-[11px] rounded-full px-1.5 py-0.5 font-medium
                            ${days <= 30  ? "bg-rose/8 text-rose"  :
                              days <= 90  ? "bg-gold/8 text-gold"  :
                              "bg-slate-100 text-slate-500"}`}>
                            {days > 0 ? `${days}d` : "expired"}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Last Checked */}
                  <td className="px-4 py-3.5 text-[11px] text-slate-400 whitespace-nowrap">
                    {formatDateTime(rec.lastChecked)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onRowClick(rec)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line
                        px-2.5 py-1.5 text-xs font-medium text-slate-500
                        hover:border-blue/50 hover:text-blue hover:bg-blue/[0.04] transition"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between
        border-t border-line bg-slate-50/60 px-5 py-3">
        <p className="text-xs text-slate-500 whitespace-nowrap">
          {sorted.length === 0
            ? "No results"
            : `Showing ${from}–${to} of ${sorted.length} record${sorted.length !== 1 ? "s" : ""}`}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-line
                text-slate-500 hover:border-blue/50 hover:text-blue transition
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-line disabled:hover:text-slate-500"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {/* Page numbers */}
            {pageNumbers().map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-slate-400 select-none">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`inline-flex items-center justify-center h-7 min-w-[28px] px-1.5 rounded-lg
                    text-xs font-medium transition border
                    ${currentPage === p
                      ? "bg-blue text-white border-blue shadow-sm"
                      : "border-line text-slate-600 hover:border-blue/50 hover:text-blue"
                    }`}
                >
                  {p}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-line
                text-slate-500 hover:border-blue/50 hover:text-blue transition
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-line disabled:hover:text-slate-500"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
