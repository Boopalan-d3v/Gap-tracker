"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StatusBadge } from "./status-badge";

function DataRow({ label, value, mono = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-1.5 border-b border-line/50 last:border-0">
      <span className="w-36 flex-shrink-0 text-[11px] text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <span className={`text-xs text-slate-700 ${mono ? "font-mono" : ""}`}>
        {value ?? <span className="italic text-slate-400">—</span>}
      </span>
    </div>
  );
}

function JsonViewer({ data }) {
  const [open, setOpen] = useState(false);
  const formatted = JSON.stringify(data, null, 2);
  return (
    <div className="mt-3 rounded-lg border border-line overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 bg-slate-50 text-xs
          text-slate-500 hover:text-slate-800 transition"
      >
        <span className="font-medium uppercase tracking-wider">Raw Registry Response</span>
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open && (
          <pre className="overflow-x-auto px-3 py-2.5 text-xs text-teal bg-slate-50 leading-relaxed max-h-48">
          {formatted}
        </pre>
      )}
    </div>
  );
}

export function RowDetailDrawer({ record, onClose, onMarkReviewed, onRevert }) {
  const drawerRef = useRef(null);
  const [reviewNote, setReviewNote] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Trap focus inside drawer
  useEffect(() => {
    drawerRef.current?.focus();
  }, []);

  if (!record) return null;

  function handleMarkReviewed() {
    if (!reviewNote.trim()) return;
    onMarkReviewed(record.id, reviewNote.trim());
    setReviewNote("");
    setShowReviewForm(false);
  }

  const isNameMatch = record.matchMethod === "name_match";
  const isReviewed = record.status === "reviewed";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        tabIndex={-1}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto bg-white
          border-l border-line shadow-drawer outline-none drawer-enter"
        role="dialog"
        aria-label={`Details for ${record.deviceName} — ${record.jurisdiction}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-line bg-white px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-blue">
              Device Detail
            </p>
            <h2 className="mt-0.5 text-base font-semibold text-slate-900">{record.deviceName}</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded bg-slate-100 border border-line px-1.5 py-0.5 text-[11px] font-mono text-slate-600">
                {record.jurisdiction}
              </span>
              <StatusBadge status={record.status} size="sm" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-3 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition flex-shrink-0"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Name-match disclaimer */}
          {isNameMatch && (
            <div className="flex gap-2.5 rounded-lg border border-gold/30 bg-gold/5 px-3 py-2.5">
              <AlertTriangle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gold">Name-match result</p>
                <p className="mt-0.5 text-[11px] text-slate-400 leading-relaxed">
                  Match based on device name and manufacturer — verify against your clearance document.
                </p>
              </div>
            </div>
          )}

          {/* Reviewed note */}
          {isReviewed && record.reviewNote && (
            <div className="flex gap-2.5 rounded-lg border border-blue/30 bg-blue/5 px-3 py-2.5">
              <ShieldCheck className="h-4 w-4 text-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue">Manually Reviewed</p>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">{record.reviewNote}</p>
                {record.reviewedBy && (
                  <p className="mt-1 text-xs text-slate-500">
                    By {record.reviewedBy} ·{" "}
                    {record.reviewedAt
                      ? new Date(record.reviewedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Core details */}
          <section>
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Registration Details
            </h3>
            <div className="rounded-lg border border-line bg-slate-50 px-3 py-1 divide-y divide-line/40">
              <DataRow label="Clearance No." value={record.clearanceNumber} mono />
              <DataRow
                label="Expiry Date"
                value={
                  record.expiryDate
                    ? new Date(record.expiryDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : null
                }
              />
              <DataRow
                label="Last Checked"
                value={
                  record.lastChecked
                    ? new Date(record.lastChecked).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : null
                }
              />
              <DataRow
                label="Match Method"
                value={record.matchMethod === "exact_number" ? "Exact number match" : "Name similarity match"}
              />
            </div>
          </section>

          {/* Registry link */}
          {record.registryUrl && (
            <section>
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Public Registry
              </h3>
              <a
                href={record.registryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2
                  text-xs text-slate-600 hover:border-blue/60 hover:text-blue transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open {record.jurisdiction} Registry
              </a>
            </section>
          )}

          {/* Raw registry response */}
          {record.registryResponse && <JsonViewer data={record.registryResponse} />}

          {/* Status management */}
          <section>
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Status Management
            </h3>

            {!isReviewed && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-blue/10 border border-blue/30
                  px-3 py-2 text-xs font-medium text-blue hover:bg-blue/20 transition"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark as Reviewed — Clearance Confirmed
              </button>
            )}

            {showReviewForm && !isReviewed && (
              <div className="space-y-2.5 fade-in">
                <p className="text-[11px] text-slate-400">
                  Add a note confirming this clearance. Alerts for this record will be suppressed
                  until the next status change.
                </p>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="e.g. Clearance confirmed via vendor portal. Certificate on file."
                  rows={3}
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-slate-800
                  placeholder-slate-400 outline-none focus:border-blue/60 focus:ring-1 focus:ring-blue/20
                    resize-none transition"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkReviewed}
                    disabled={!reviewNote.trim()}
                    className="inline-flex items-center gap-1.5 rounded-md bg-teal/20 border border-teal/40
                      px-3 py-1.5 text-xs font-medium text-teal hover:bg-teal/30 transition
                      disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Confirm Review
                  </button>
                  <button
                    onClick={() => { setShowReviewForm(false); setReviewNote(""); }}
                    className="rounded-md border border-line px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {isReviewed && (
              <button
                onClick={() => onRevert(record.id)}
                className="inline-flex items-center gap-1.5 rounded-md border border-rose/30
                  px-3 py-2 text-xs text-rose/80 hover:border-rose/60 hover:text-rose transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Revert to Gap Detected
              </button>
            )}
          </section>
        </div>
      </aside>
    </>
  );
}
