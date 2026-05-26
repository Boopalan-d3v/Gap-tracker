"use client";

import { useState } from "react";
import { Bell, AlertTriangle, Clock, X, CheckCircle2 } from "lucide-react";

export function NotificationBell({ alerts, onDismiss, onOpen }) {
  const [open, setOpen] = useState(false);
  const count = alerts.length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg border border-line p-2 text-slate-500
          hover:border-blue/50 hover:text-blue transition"
        aria-label={`${count} active alert${count !== 1 ? "s" : ""}`}
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center
            rounded-full bg-rose text-[10px] font-bold text-white pulse-rose min-w-[18px] h-[18px] px-1">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 z-40 w-72 rounded-lg border border-line
            bg-panel shadow-panel fade-in overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-line bg-slate-50">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-900">Notifications</span>
                {count > 0 && (
                  <span className="rounded-full bg-rose/20 text-rose text-xs px-1.5 py-0.5 font-bold">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Notification list */}
            <div className="max-h-64 overflow-y-auto divide-y divide-line">
              {alerts.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-5 text-center">
                  <CheckCircle2 className="h-6 w-6 text-teal/50" />
                  <p className="text-xs text-slate-500">All caught up!</p>
                </div>
              )}
              {alerts.map((alert) => {
                const isGap = alert.status === "gap_detected";
                const Icon = isGap ? AlertTriangle : Clock;
                const color = isGap ? "text-rose" : "text-gold";

                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-2.5 px-3 py-2 hover:bg-line/30 transition group"
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${color}`} />
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => { onOpen(alert); setOpen(false); }}
                    >
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {alert.deviceName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {alert.jurisdiction} · {isGap ? "Gap Detected" : "Expiring Soon"}
                      </p>
                    </div>
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose transition flex-shrink-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {alerts.length > 0 && (
              <div className="px-3 py-2 border-t border-line bg-slate-50">
                <button
                  onClick={() => alerts.forEach((a) => onDismiss(a.id))}
                  className="text-xs text-slate-500 hover:text-slate-700 transition"
                >
                  Dismiss all
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
