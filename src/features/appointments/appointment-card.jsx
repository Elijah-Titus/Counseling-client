import { useState } from "react";
import { ChevronDown, Clock, History, User } from "lucide-react";
import { Link } from "react-router-dom";
import { getAppointmentBadge, isUpcoming } from "../../utils/appointment-status";
import JoinSession from "../../features/appointments/join-session";
import {
  canStillCancel,
  formatLagosDate,
  formatLagosTime,
  getLagosDateParts,
} from "../../utils/lagos-time";

export default function AppointmentCard({ appointment, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const a = appointment;

  const { day, month, weekday } = getLagosDateParts(a.startAt);
  const hours = Math.round((new Date(a.endAt) - new Date(a.startAt)) / 3600000);

  const badge = getAppointmentBadge(a, "CLIENT");
  const isScheduled = isUpcoming(a);
  const cancellable = isScheduled && canStillCancel(a.startAt);

  return (
    <li className="rounded-2xl bg-white/80 p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
          <span className="text-lg font-extrabold leading-none">{day}</span>
          <span className="text-[11px] font-semibold uppercase">{month}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-blue-950">
              <Link
                to={`/dashboard/appointments/${a.id}`}
                className="transition hover:text-indigo-600 hover:underline"
              >
                {a.topic}
              </Link>
            </h3>
            <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${badge.style}`}>
              {badge.label}
            </span>
            {a.unreadMessages > 0 && (
              <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                {a.unreadMessages} new {a.unreadMessages === 1 ? "message" : "messages"}
              </span>
            )}
          </div>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <User size={14} /> {a.counselor?.name}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <Clock size={13} />
            {weekday}, {formatLagosTime(a.startAt)} – {formatLagosTime(a.endAt)} · {hours}{" "}
            {hours === 1 ? "hour" : "hours"} · Lagos time
          </p>
        </div>
      </div>

      {a.originalStartAt && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          <History size={15} className="mt-0.5 shrink-0" />
          <p>
            Your counselor rescheduled this session. It was originally on{" "}
            {formatLagosDate(a.originalStartAt)} at {formatLagosTime(a.originalStartAt)}.
          </p>
        </div>
      )}

      {a.abandoned && (
        <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          You didn't attend this session. You can book a new one at any time.
        </div>
      )}

      {expanded && (
        <p className="mt-3 rounded-xl bg-indigo-50/60 p-3 text-sm leading-relaxed text-slate-600">
          {a.description}
        </p>
      )}

      {a.meetLink && (
        <div className="mt-3">
          <JoinSession appointment={a} />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
        >
          {expanded ? "Hide details" : "Show details"}
          <ChevronDown size={14} className={`transition ${expanded ? "rotate-180" : ""}`} />
        </button>

        {cancellable ? (
          <button
            onClick={() => onCancel(a)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            Cancel session
          </button>
        ) : (
          isScheduled && (
            <p className="text-xs text-slate-400">Cancellation is closed for this session.</p>
          )
        )}
      </div>
    </li>
  );
}