"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  RefreshCw,
} from "lucide-react";
import { useTrackerData } from "../../hooks/use-tracker-data";
import { SubmissionTable } from "../../components/submission-table";
import { RowDetailDrawer } from "../../components/row-detail-drawer";
import { AlertPanel } from "../../components/alert-panel";
import { FiltersBar } from "../../components/filters-bar";
import { ExportButton } from "../../components/export-button";
import { NotificationBell } from "../../components/notification-bell";
import { TrendChart } from "../../components/trend-chart";
import { computeStats } from "../../lib/mock-data";

const DEFAULT_FILTERS = { search: "", jurisdiction: "all", status: "all" };

export default function DashboardPage() {
  const {
    records,
    activeAlerts,
    lastPollAt,
    isPolling,
    markReviewed,
    revertStatus,
    dismissNotification,
    manualRefresh,
  } = useTrackerData();

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const stats = useMemo(() => computeStats(records), [records]);

  const filteredRecords = useMemo(() => {
    let result = records;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.deviceName.toLowerCase().includes(q) ||
          r.jurisdiction.toLowerCase().includes(q) ||
          (r.clearanceNumber ?? "").toLowerCase().includes(q)
      );
    }
    if (filters.jurisdiction !== "all") {
      result = result.filter((r) => r.jurisdiction === filters.jurisdiction);
    }
    if (filters.status !== "all") {
      result = result.filter((r) => r.status === filters.status);
    }
    return result;
  }, [records, filters]);

  function openDrawer(record) {
    setSelectedRecord(record);
  }

  function closeDrawer() {
    setSelectedRecord(null);
  }

  function handleMarkReviewed(id, note) {
    markReviewed(id, note);
    // Update the open drawer record to show reviewed state
    setSelectedRecord((prev) =>
      prev?.id === id
        ? {
            ...prev,
            status: "reviewed",
            reviewNote: note,
            reviewedAt: new Date().toISOString(),
            reviewedBy: "Current User",
          }
        : prev
    );
  }

  function handleRevert(id) {
    revertStatus(id);
    setSelectedRecord((prev) =>
      prev?.id === id
        ? { ...prev, status: "gap_detected", reviewNote: null, reviewedAt: null, reviewedBy: null }
        : prev
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-[1400px] px-4 py-3 md:px-8 xl:px-10 space-y-3">
        {/* ── Top nav bar ─────────────────────────────────────────────────── */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Submission Gap Tracker
            </h1>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Regulatory clearance status across all market jurisdictions
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            {/* Poll status */}
            <div className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-[11px] text-slate-500">
              <Activity className={`h-3 w-3 ${isPolling ? "text-teal animate-pulse" : "text-slate-400"}`} />
              {lastPollAt
                ? `Updated ${lastPollAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "Live · 30s"}
            </div>
            <button
              onClick={manualRefresh}
              disabled={isPolling}
              className="rounded-md border border-line p-1.5 text-slate-500 hover:border-blue/50 hover:text-blue
                transition disabled:opacity-50"
              aria-label="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${isPolling ? "animate-spin" : ""}`} />
            </button>
            <NotificationBell
              alerts={activeAlerts}
              onDismiss={dismissNotification}
              onOpen={openDrawer}
            />
            <ExportButton records={filteredRecords} />
          </div>
        </header>

        {/* ── Stats + Charts combined row ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* ── Status overview panel ── */}
          <div className="lg:col-span-4">
            <div className="rounded-lg border border-line bg-white shadow-panel overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-line bg-slate-50/60">
                <span className="text-xs font-extrabold tracking-wide text-slate-700">Status Overview</span>
                <span className="font-mono text-[10px] text-slate-400">{stats.total} devices</span>
              </div>
              {/* Metric rows */}
              <div className="divide-y divide-line">
                {[
                  { value: stats.gaps,     label: "Clearance Gaps",   sub: "Action required",    bar: "bg-rose"  },
                  { value: stats.expiring,  label: "Pending Renewals", sub: "Due within 90 days", bar: "bg-gold"  },
                  { value: stats.active,    label: "Compliant",        sub: "Valid registration", bar: "bg-teal"  },
                ].map(({ value, label, sub, bar }) => (
                  <div key={label} className="flex items-center gap-3 px-3 py-2.5">
                    <div className={`w-0.5 self-stretch rounded-full flex-shrink-0 ${bar}`} />
                    <div className="relative z-10">
                      <p className="text-xl font-extrabold text-slate-900 leading-none tracking-tight tabular-nums">{value}</p>
                      <p className="text-[11px] font-semibold text-slate-600 mt-0.5">{label}</p>
                      <p className="text-[10px] text-slate-400">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Composition bar footer */}
              <div className="px-3 py-2 border-t border-line bg-slate-50/50">
                <div className="flex rounded-full overflow-hidden h-1.5 gap-px">
                  <div className="bg-rose   rounded-l-full transition-all duration-700" style={{ width: `${stats.total > 0 ? (stats.gaps     / stats.total) * 100 : 0}%` }} />
                  <div className="bg-gold             transition-all duration-700" style={{ width: `${stats.total > 0 ? (stats.expiring / stats.total) * 100 : 0}%` }} />
                  <div className="bg-teal             transition-all duration-700" style={{ width: `${stats.total > 0 ? (stats.active   / stats.total) * 100 : 0}%` }} />
                  <div className="bg-blue  rounded-r-full transition-all duration-700 flex-1" />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-slate-400">{stats.reviewed} reviewed</span>
                  <span className="text-[10px] text-slate-400">{stats.total} monitored</span>
                </div>
              </div>
            </div>
          </div>
          {/* Charts column */}
          <div className="lg:col-span-8">
            <TrendChart records={records} />
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────────── */}
        {activeAlerts.length > 0 && (
          <AlertPanel
            alerts={activeAlerts}
            onDismiss={dismissNotification}
            onOpen={openDrawer}
          />
        )}

        {/* ── Dashboard Table ─────────────────────────────────────────────── */}
        <section className="rounded-lg border border-line bg-white shadow-panel overflow-hidden">
          <div className="flex flex-col gap-2.5 px-4 pt-3.5 pb-3 border-b border-line">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">Regulatory Clearance Status</h2>
            </div>
            <FiltersBar
              filters={filters}
              onChange={setFilters}
              totalVisible={filteredRecords.length}
              totalAll={records.length}
            />
          </div>
          <SubmissionTable records={filteredRecords} onRowClick={openDrawer} />
        </section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="text-center text-[11px] text-slate-400 pb-3">
          Regulatory Submission Gap Tracker &middot; Auto-refreshes every 30s &middot; Name-match findings require manual registry verification
        </footer>
      </div>

      {/* ── Row detail drawer ───────────────────────────────────────────── */}
      {selectedRecord && (
        <RowDetailDrawer
          record={selectedRecord}
          onClose={closeDrawer}
          onMarkReviewed={handleMarkReviewed}
          onRevert={handleRevert}
        />
      )}
    </div>
  );
}
