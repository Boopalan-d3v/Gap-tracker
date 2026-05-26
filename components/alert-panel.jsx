"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  X,
  Mail,
  Slack,
  Bell,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

function AlertCard({ alert, onDismiss, onOpen }) {
  const isGap = alert.status === "gap_detected";

  const accent    = isGap ? "border-l-rose" : "border-l-gold";
  const iconBg    = isGap ? "bg-rose/8"     : "bg-gold/8";
  const iconColor = isGap ? "text-rose"     : "text-gold";
  const badgeCls  = isGap
    ? "bg-rose/8 text-rose border-rose/20"
    : "bg-gold/8 text-gold border-gold/20";
  const Icon = isGap ? AlertTriangle : Clock;

  const expiryStr = alert.expiryDate
    ? new Date(alert.expiryDate).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "N/A";

  return (
    <div className={`group relative flex border-l-[3px] ${accent} bg-white border border-line
      border-l-0 rounded-r-lg shadow-sm hover:shadow-md transition-all duration-200`}>

      {/* Left icon */}
      <div className="flex items-start px-3 pt-2.5 pb-2">
        <div className={`rounded-md p-1.5 ${iconBg}`}>
          <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-2.5 pb-2 pr-3">
        {/* Top row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate-800 text-xs leading-snug">{alert.deviceName}</span>
          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 rounded px-1.5 py-0.5 border border-line">
            {alert.jurisdiction}
          </span>
          <span className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 tracking-wide ${badgeCls}`}>
            {isGap ? "Gap Detected" : "Expiring Soon"}
          </span>
        </div>

        {/* Description */}
        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
          {isGap
            ? `RP360 could not find a current clearance for ${alert.deviceName} in ${alert.jurisdiction}. Your product master indicates this device is marketed in ${alert.jurisdiction}. Please verify registration status.`
            : `The clearance for ${alert.deviceName} in ${alert.jurisdiction} expires on ${expiryStr} — ${Math.ceil((new Date(alert.expiryDate) - Date.now()) / (1000 * 60 * 60 * 24))} days from today.`}
        </p>

        {/* Hover-expand metadata */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300">
          <div className="overflow-hidden">
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 rounded-md bg-slate-50 border border-line px-2.5 py-1.5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Match Method</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {alert.matchMethod === "exact_number" ? "Exact clearance number" : "Name similarity match"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Last Verified</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {new Date(alert.lastChecked).toLocaleString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right actions — compact, two buttons only */}
      <div className="flex flex-col items-center gap-0.5 px-1.5 py-2">
        <button
          onClick={() => onOpen(alert)}
          title="Open details"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-blue/8 hover:text-blue transition"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDismiss(alert.id)}
          title="Dismiss"
          className="rounded-lg p-1.5 text-slate-300 hover:bg-rose/8 hover:text-rose transition"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function AlertPanel({ alerts, onDismiss, onOpen }) {
  const gaps     = alerts.filter((a) => a.status === "gap_detected");
  const expiring = alerts.filter((a) => a.status === "expiring_soon");
  const [showAll, setShowAll] = useState(false);
  const visible  = showAll ? alerts : alerts.slice(0, 5);

  /* ── Empty state ── */
  if (alerts.length === 0) {
    return (
      <section className="rounded-xl border border-line bg-white p-6 shadow-panel">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-teal/8 p-2">
            <CheckCircle2 className="h-5 w-5 text-teal" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">All Clear</h2>
            <p className="text-xs text-slate-500 mt-0.5">No active compliance alerts at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-line bg-white shadow-panel overflow-hidden">

      {/* ── Header bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-line bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose pulse-rose" />
          </div>
          <h2 className="text-sm font-semibold text-slate-800">Active Alerts</h2>
          <div className="flex items-center gap-1.5">
            {gaps.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose/8 border border-rose/20
                px-2.5 py-0.5 text-[11px] font-semibold text-rose">
                <span className="h-1.5 w-1.5 rounded-full bg-rose" />
                {gaps.length} Critical
              </span>
            )}
            {expiring.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/8 border border-gold/20
                px-2.5 py-0.5 text-[11px] font-semibold text-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {expiring.length} Warning
              </span>
            )}
          </div>
        </div>

        {/* Delivery channels */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mr-1">
            Notify via
          </span>
          {[
            { Icon: Bell,  label: "In-App", active: true },
            { Icon: Mail,  label: "Email",  active: true },
            { Icon: Slack, label: "Slack",  active: false },
          ].map(({ Icon, label, active }) => (
            <span
              key={label}
              title={active ? `${label} notifications active` : `${label} not configured`}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium
                ${active
                  ? "border-teal/30 bg-teal/8 text-teal"
                  : "border-line bg-white text-slate-400 opacity-50"}`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Alert list ── */}
      <div className="divide-y divide-line">
        {visible.map((alert) => (
          <div key={alert.id} className="px-3 py-2">
            <AlertCard alert={alert} onDismiss={onDismiss} onOpen={onOpen} />
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      {alerts.length > 5 && (
        <div className="px-4 py-2 border-t border-line bg-slate-50/70">
          <button
            onClick={() => setShowAll((o) => !o)}
            className="text-xs font-medium text-slate-500 hover:text-blue transition"
          >
            {showAll ? "Show fewer alerts" : `View ${alerts.length - 5} more alert${alerts.length - 5 !== 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </section>
  );
}
