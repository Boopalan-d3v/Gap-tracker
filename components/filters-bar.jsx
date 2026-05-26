"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { JURISDICTIONS } from "../lib/mock-data";

const STATUS_OPTIONS = [
  { value: "all",           label: "All Statuses",  dot: null },
  { value: "gap_detected",  label: "Gap Detected",  dot: "bg-rose" },
  { value: "expiring_soon", label: "Expiring Soon", dot: "bg-gold" },
  { value: "active",        label: "Active",        dot: "bg-teal" },
  { value: "reviewed",      label: "Reviewed",      dot: "bg-blue" },
];

const JURISDICTION_OPTIONS = [
  { value: "all", label: "All Jurisdictions", dot: null },
  ...JURISDICTIONS.map((j) => ({ value: j, label: j, dot: null })),
];

function CustomSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white
          px-2.5 py-1.5 text-xs text-slate-700 hover:border-blue/50 transition min-w-[140px]
          focus:outline-none focus:ring-1 focus:ring-blue/20 focus:border-blue/60"
      >
        {selected.dot && <span className={`h-2 w-2 rounded-full flex-shrink-0 ${selected.dot}`} />}
        <span className="flex-1 text-left truncate">{selected.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-30 min-w-full rounded-lg border border-line
          bg-white shadow-panel overflow-hidden fade-in">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-xs text-left transition
                  ${active ? "bg-blue/5 text-blue font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                {opt.dot
                  ? <span className={`h-2 w-2 rounded-full flex-shrink-0 ${opt.dot}`} />
                  : <span className="h-2 w-2 flex-shrink-0" />}
                {opt.label}
                {active && (
                  <svg className="ml-auto h-3.5 w-3.5 text-blue flex-shrink-0" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2,7 6,11 12,3" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FiltersBar({ filters, onChange, totalVisible, totalAll }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  function clearAll() {
    onChange({ search: "", jurisdiction: "all", status: "all" });
  }

  const isFiltered =
    filters.search || filters.jurisdiction !== "all" || filters.status !== "all";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search devices…"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="w-full rounded-md border border-line bg-white pl-8 pr-8 py-1.5 text-xs text-slate-800
            placeholder-slate-400 outline-none focus:border-blue/60 focus:ring-1 focus:ring-blue/20 transition"
        />
        {filters.search && (
          <button
            onClick={() => set("search", "")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Jurisdiction filter */}
      <CustomSelect
        value={filters.jurisdiction}
        onChange={(v) => set("jurisdiction", v)}
        options={JURISDICTION_OPTIONS}
      />

      {/* Status filter */}
      <CustomSelect
        value={filters.status}
        onChange={(v) => set("status", v)}
        options={STATUS_OPTIONS}
      />

      {/* Result count + clear */}
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-slate-500">
          {totalVisible === totalAll
            ? `${totalAll} records`
            : `${totalVisible} of ${totalAll}`}
        </span>
        {isFiltered && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs
              text-slate-500 hover:border-rose/40 hover:text-rose transition"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
