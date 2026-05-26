"use client";

import { computeStats } from "../lib/mock-data";

const JURISDICTION_COLORS = {
  "US-FDA": "#58a6ff",
  "EU-CE": "#1fc1b2",
  "Health Canada": "#8ce6c2",
  PMDA: "#a78bfa",
  TGA: "#f3c969",
  ANVISA: "#ff6b88",
};

const STATUS_COLORS = {
  gap_detected: "#ff6b88",
  expiring_soon: "#f3c969",
  active: "#1fc1b2",
  reviewed: "#58a6ff",
};

const STATUS_LABELS = {
  gap_detected: "Gap Detected",
  expiring_soon: "Expiring Soon",
  active: "Active",
  reviewed: "Reviewed",
};


function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const radius = 43;
  const cx = 56;
  const cy = 56;
  const circumference = 2 * Math.PI * radius;
  const STROKE = 9;
  const GAP = 4; // gap between rounded caps
  let offset = 0;

  const segments = data
    .filter((d) => d.value > 0)
    .map((d) => {
      const pct = d.value / total;
      const dashLength = Math.max(pct * circumference - GAP, 0);
      const seg = { ...d, dashLength, dashOffset: -offset };
      offset += pct * circumference;
      return seg;
    });

  return (
    <div className="relative w-full aspect-square">
      <svg viewBox="0 0 112 112" className="w-full h-full -rotate-90">
        {/* Background track */}
        <circle cx={cx} cy={cy} r={radius} fill="none" strokeWidth={STROKE} stroke="#f1f5f9" />
        {segments.map((seg) => (
          <circle
            key={seg.label}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            strokeWidth={STROKE}
            stroke={seg.color}
            strokeDasharray={`${seg.dashLength} ${circumference}`}
            strokeDashoffset={seg.dashOffset}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-slate-900 leading-none">{total}</span>
        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Total</span>
      </div>
    </div>
  );
}

export function TrendChart({ records }) {
  const stats = computeStats(records);

  const donutData = [
    { label: "Gap Detected", value: stats.gaps, color: STATUS_COLORS.gap_detected },
    { label: "Expiring Soon", value: stats.expiring, color: STATUS_COLORS.expiring_soon },
    { label: "Active", value: stats.active, color: STATUS_COLORS.active },
    { label: "Reviewed", value: stats.reviewed, color: STATUS_COLORS.reviewed },
  ];

  // Compute per-jurisdiction breakdown
  const byJurisdiction = {};
  records.forEach((r) => {
    if (!byJurisdiction[r.jurisdiction]) byJurisdiction[r.jurisdiction] = 0;
    if (r.status === "gap_detected" || r.status === "expiring_soon") {
      byJurisdiction[r.jurisdiction]++;
    }
  });

  const jurisdictionIssues = Object.entries(byJurisdiction)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  const total = donutData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 h-full">

      {/* ── Status Distribution ── */}
      <div className="rounded-lg border border-line bg-white shadow-panel overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 border-b border-line bg-slate-50/60">
          <span className="text-xs font-extrabold tracking-wide text-slate-700">Status Distribution</span>
          <span className="font-mono text-[10px] text-slate-400">{total} total</span>
        </div>
        <div className="flex items-stretch px-3 py-2 flex-1">
          <div className="w-[60%] flex-shrink-0 p-1.5">
            <DonutChart data={donutData} />
          </div>
          <div className="w-[40%] pl-3 flex flex-col justify-center space-y-2">
            {donutData.filter((d) => d.value > 0).map((d) => {
              const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
              return (
                <div key={d.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-[11px] text-slate-600">{d.label}</span>
                    </div>
                    <div className="flex items-center gap-1 tabular-nums">
                      <span className="text-xs font-bold text-slate-800">{d.value}</span>
                      <span className="text-[10px] text-slate-400 w-7 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-0.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Issues by Jurisdiction ── */}
      <div className="rounded-lg border border-line bg-white shadow-panel overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 border-b border-line bg-slate-50/60">
          <span className="text-xs font-extrabold tracking-wide text-slate-700">Issues by Jurisdiction</span>
          <span className="font-mono text-[10px] text-slate-400">{jurisdictionIssues.length} affected</span>
        </div>
        {jurisdictionIssues.length === 0 ? (
          <p className="text-xs text-slate-500 p-4">No issues across jurisdictions.</p>
        ) : (
          <div className="p-3 space-y-2.5">
            {jurisdictionIssues.map(([jurisdiction, count]) => {
              const jTotal = records.filter((r) => r.jurisdiction === jurisdiction).length;
              const pct    = jTotal > 0 ? Math.round((count / jTotal) * 100) : 0;
              const color  = JURISDICTION_COLORS[jurisdiction] ?? "#58a6ff";
              return (
                <div key={jurisdiction}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-semibold text-slate-700">{jurisdiction}</span>
                    <div className="flex items-center gap-2 tabular-nums">
                      <span className="text-[10px] text-slate-400">{count}/{jTotal}</span>
                      <span className="text-xs font-bold text-slate-800 w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
