"use client";

const STATUS_CONFIG = {
  gap_detected: {
    label: "Gap Detected",
    bg: "bg-rose/10",
    text: "text-rose",
    ring: "ring-rose/30",
    dot: "bg-rose",
    pulse: true,
  },
  expiring_soon: {
    label: "Expiring Soon",
    bg: "bg-gold/10",
    text: "text-gold",
    ring: "ring-gold/30",
    dot: "bg-gold",
    pulse: false,
  },
  active: {
    label: "Active",
    bg: "bg-teal/10",
    text: "text-teal",
    ring: "ring-teal/30",
    dot: "bg-teal",
    pulse: false,
  },
  reviewed: {
    label: "Reviewed",
    bg: "bg-blue/10",
    text: "text-blue",
    ring: "ring-blue/30",
    dot: "bg-blue",
    pulse: false,
  },
};

export function StatusBadge({ status, size = "md" }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
  const textSize = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset
        ${cfg.bg} ${cfg.text} ${cfg.ring} ${textSize}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${cfg.dot} ${cfg.pulse ? "pulse-rose" : ""}`}
      />
      {cfg.label}
    </span>
  );
}

export { STATUS_CONFIG };
