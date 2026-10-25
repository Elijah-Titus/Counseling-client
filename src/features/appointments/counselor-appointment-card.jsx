import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Clock, History, Lock, User } from "lucide-react";
import {
  formatLagosDate,
  formatLagosTime,
  getLagosDateParts,
} from "../../utils/lagos-time";

const statusInfo = {
  AWAITING: { label: "Scheduled", style: "bg-indigo-100 text-indigo-700" },
  COMPLETED: { label: "Completed", style: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", style: "bg-slate-200 text-slate-600" },
};

export default function CounselorAppointmentCard({ appointment, onReschedule }) {
  const [expanded, setExpanded] = useState(false);
  const a = appointment;

  const { day, month, weekday } = getLagosDateParts(a.startAt);
  const hours = Math.round((new Date(a.endAt) - new Date(a.startAt)) / 3600000);

  const badge = a.abandoned
    ? { label: "Client didn't attend", style: "bg-amber-100 text-amber-700" }
    : statusInfo[a.status] || statusInfo.AWAITING;

  const isScheduled = a.status === "AWAITING" && !a.abandoned;
  const alreadyMoved = Boolean(a.originalStartAt);
  const notStarted = Date.now() < new Date(a.startAt).getTime();
  const canReschedule = isScheduled && !alreadyMoved && notStarted;

  return (
    <li className="rounded-2xl bg-white/80 p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
          <span className="text-lg font-extrabold leading-none">{day}</span>
          <span className="text-[11px] font-semibold uppercase">{month}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/counselor/appointments/${a.id}`} className="transition hover:text-indigo-600 hover:underline">
            {a.topic}
          </Link>
            <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${badge.style}`}>
              {badge.label}
            </span>
          </div>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <User size={14} /> {a.client?.name}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <Clock size={13} />
            {weekday}, {formatLagosTime(a.startAt)} – {formatLagosTime(a.endAt)} · {hours}{" "}
            {hours === 1 ? "hour" : "hours"} · Lagos time
          </p>
        </div>
      </div>

      {alreadyMoved && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          <History size={15} className="mt-0.5 shrink-0" />
          <p>
            This session was rescheduled. It was originally on{" "}
            {formatLagosDate(a.originalStartAt)} at {formatLagosTime(a.originalStartAt)}.
          </p>
        </div>
      )}

      {expanded && (
        <div className="mt-3 space-y-3">
          <div className="rounded-xl bg-indigo-50/60 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Message from {a.client?.name}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{a.description}</p>
          </div>

          <div className="rounded-xl bg-violet-50/70 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Lock size={12} /> Private notes
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {a.notes || "No notes for this session yet."}
            </p>
          </div>
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

        {canReschedule ? (
          <button
            onClick={() => onReschedule(a)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Reschedule
          </button>
        ) : (
          isScheduled &&
          alreadyMoved && (
            <p className="text-xs text-slate-400">Already rescheduled once.</p>
          )
        )}
      </div>
    </li>
  );
}