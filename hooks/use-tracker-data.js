"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { INITIAL_RECORDS, sortRecords } from "../lib/mock-data";

const POLL_INTERVAL_MS = 30_000; // 30 seconds

function reducer(state, action) {
  switch (action.type) {
    case "SET_RECORDS":
      return { ...state, records: action.payload, lastPollAt: new Date() };

    case "MARK_REVIEWED": {
      const updated = state.records.map((r) =>
        r.id === action.payload.id
          ? {
              ...r,
              status: "reviewed",
              reviewNote: action.payload.note,
              reviewedAt: new Date().toISOString(),
              reviewedBy: action.payload.reviewedBy,
            }
          : r
      );
      return { ...state, records: updated };
    }

    case "REVERT_STATUS": {
      const updated = state.records.map((r) =>
        r.id === action.payload
          ? { ...r, status: "gap_detected", reviewNote: null, reviewedAt: null, reviewedBy: null }
          : r
      );
      return { ...state, records: updated };
    }

    case "DISMISS_NOTIFICATION": {
      return {
        ...state,
        dismissedIds: new Set([...state.dismissedIds, action.payload]),
      };
    }

    case "SET_POLLING":
      return { ...state, isPolling: action.payload };

    default:
      return state;
  }
}

const initialState = {
  records: sortRecords(INITIAL_RECORDS),
  lastPollAt: null,
  isPolling: false,
  dismissedIds: new Set(),
};

export function useTrackerData() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timerRef = useRef(null);

  const poll = useCallback(() => {
    dispatch({ type: "SET_POLLING", payload: true });
    // Simulate async fetch — in production, replace with a real API call.
    setTimeout(() => {
      dispatch({ type: "SET_RECORDS", payload: sortRecords(state.records) });
      dispatch({ type: "SET_POLLING", payload: false });
    }, 600);
  }, [state.records]);

  useEffect(() => {
    timerRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [poll]);

  const markReviewed = useCallback((id, note, reviewedBy = "Current User") => {
    dispatch({ type: "MARK_REVIEWED", payload: { id, note, reviewedBy } });
  }, []);

  const revertStatus = useCallback((id) => {
    dispatch({ type: "REVERT_STATUS", payload: id });
  }, []);

  const dismissNotification = useCallback((id) => {
    dispatch({ type: "DISMISS_NOTIFICATION", payload: id });
  }, []);

  const activeAlerts = state.records.filter(
    (r) =>
      (r.status === "gap_detected" || r.status === "expiring_soon") &&
      !state.dismissedIds.has(r.id)
  );

  return {
    records: state.records,
    activeAlerts,
    lastPollAt: state.lastPollAt,
    isPolling: state.isPolling,
    markReviewed,
    revertStatus,
    dismissNotification,
    manualRefresh: poll,
  };
}
