import { useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  ClipboardCheck,
  Link2,
  Loader2,
  Shuffle,
} from "lucide-react";
import { getAppointmentHistory } from "../../api/admin";
import { getErrorMessage } from "../../api/axios";
import { formatLagosDate, formatLagosTime } from "../../utils/lagos-time";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T/;

// Metadata can hold times or plain values, so show whichever it is.
const show = (value) =>
  typeof value === "string" && ISO_DATE.test(value)
    ? `${formatLagosDate(value)} at ${formatLagosTime(value)}`
    : String(value);

const outcomeLabel = (value) =>
  ({ COMPLETED: "Completed", NO_SHOW: "Client didn't attend" })[value] || String(value);

const eventInfo = {
  BOOKED: { icon: CalendarPlus, tone: "bg-indigo-100 text-indigo-700", title: "Booked" },
  MEET_LINK_SET: { icon: Link2, tone: "bg-sky-100 text-sky-700", title: "Meet link added" },
  MEET_LINK_CHANGED: { icon: Link2, tone: "bg-sky-100 text-sky-700", title: "Meet link changed" },
  REASSIGNED: { icon: Shuffle, tone: "bg-violet-100 text-violet-700", title: "Reassigned" },
  RESCHEDULED: { icon: CalendarClock, tone: "bg-amber-100 text-amber-700", title: "Rescheduled" },
  CANCELLED: { icon: CalendarX, tone: "bg-slate-200 text-slate-600", title: "Cancelled" },
  OUTCOME_RECORDED: { icon: ClipboardCheck, tone: "bg-emerald-100 text-emerald-700", title: "Outcome recorded" },
};

// One plain sentence of detail for each event type.
const describe = (e) => {
  const actor = e.actor?.name || "Someone";
  const from = e.metadata?.from;
  const to = e.metadata?.to;

  switch (e.type) {
    case "BOOKED":
      return `${actor} booked this session${e.toCounselor ? `, assigned to ${e.toCounselor.name}` : ""}.`;
    case "MEET_LINK_SET":
      return `${actor} added the Meet link${to ? `: ${to}` : "."}`;
    case "MEET_LINK_CHANGED":
      return `${actor} changed the Meet link${from ? ` from ${from}` : ""}${to ? ` to ${to}` : ""}.`;
    case "REASSIGNED":
      return `Moved${e.fromCounselor ? ` from ${e.fromCounselor.name}` : ""}${
        e.toCounselor ? ` to ${e.toCounselor.name}` : ""
      }.`;
    case "RESCHEDULED":
      return `${actor} moved the session${from ? ` from ${show(from)}` : ""}${to ? ` to ${show(to)}` : ""}.`;
    case "CANCELLED":
      return `${actor} cancelled the session.`;
    case "OUTCOME_RECORDED":
      return `${actor} recorded the outcome${
        from ? `, changed from ${outcomeLabel(from)}` : ""
      }${to ? ` to ${outcomeLabel(to)}` : ""}.`;
    default:
      return actor;
  }
};

export default function HistoryPanel({ appointmentId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getAppointmentHistory(appointmentId)
      .then((data) => {
        if (!cancelled) setEvents(data.events);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Could not load the history."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

  return (
    <div className="rounded-xl bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">History</p>

      {loading ? (
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={14} className="animate-spin" /> Loading history...
        </div>
      ) : error ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-red-700">
          <AlertCircle size={14} /> {error}
        </p>
      ) : events.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No events recorded.</p>
      ) : (
        <ol className="mt-3 space-y-3">
          {events.map((e) => {
            const info = eventInfo[e.type] || { icon: CalendarCheck, tone: "bg-slate-100 text-slate-600", title: e.type };
            const Icon = info.icon;

            return (
              <li key={e.id} className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${info.tone}`}>
                  <Icon size={14} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-blue-950">{info.title}</p>
                  <p className="break-words text-sm text-slate-600">{describe(e)}</p>
                  {e.reason && <p className="text-xs italic text-slate-500">Reason: {e.reason}</p>}
                  <p className="text-xs text-slate-400">
                    {formatLagosDate(e.createdAt)} at {formatLagosTime(e.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}