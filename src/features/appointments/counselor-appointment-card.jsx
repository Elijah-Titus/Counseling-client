import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Clock, History, Lock, User, Video } from "lucide-react";
import { getAppointmentBadge, isUpcoming } from "../../utils/appointment-status";
import MeetLinkForm from "../../features/appointments/meet-link-form";
import { normalizeMeetLink } from "../../utils/meet-link";
import {
  formatLagosDate,
  formatLagosTime,
  getLagosDateParts,
} from "../../utils/lagos-time";

// const statusInfo = {
//   AWAITING: { label: "Scheduled", style: "bg-indigo-100 text-indigo-700" },
//   COMPLETED: { label: "Completed", style: "bg-emerald-100 text-emerald-700" },
//   CANCELLED: { label: "Cancelled", style: "bg-slate-200 text-slate-600" },
// };

export default function CounselorAppointmentCard({
  appointment,
  onReschedule,
  allAppointments = [],
}) {
  const [expanded, setExpanded] = useState(false);
  const a = appointment;
  const [linkAdded, setLinkAdded] = useState(Boolean(a.meetLink));

  // Returns a message if another upcoming session already uses this link
  const getLinkConflict = (link) => {
    const key = normalizeMeetLink(link);
    if (!key) return "";
    const other = allAppointments.find(
      (o) => o.id !== a.id && isUpcoming(o) && normalizeMeetLink(o.meetLink) === key
    );
    return other
      ? `This link is already used for ${other.client?.name}'s session on ${formatLagosDate(other.startAt)} at ${formatLagosTime(other.startAt)}.`
      : "";
  };
  const hasDuplicateLink = Boolean(a.meetLink) && Boolean(getLinkConflict(a.meetLink));

  // Stay in sync when the list reloads (e.g. after a reschedule clears the link)
  useEffect(() => {
    setLinkAdded(Boolean(a.meetLink));
  }, [a.meetLink]);

  const { day, month, weekday } = getLagosDateParts(a.startAt);
  const hours = Math.round((new Date(a.endAt) - new Date(a.startAt)) / 3600000);

   const badge = getAppointmentBadge(a, "COUNSELOR");
   const isScheduled = isUpcoming(a);
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
          <h3 className="font-bold text-blue-950">
            <Link
              to={`/counselor/appointments/${a.id}`}
              className="transition hover:text-indigo-600 hover:underline"
            >
              {a.topic}
            </Link>
          </h3>
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

        {isScheduled && (
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              hasDuplicateLink
                ? "bg-red-100 text-red-700"
                : linkAdded
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            <Video size={12} />
            {hasDuplicateLink ? "Link already used" : linkAdded ? "Link added" : "No link yet"}
          </span>
        )}
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
          <div className="mt-3 rounded-xl bg-indigo-50/60 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Message from {a.client?.name}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{a.description}</p>
          </div>
        )}

        {expanded && isScheduled && (
          <div className="mt-3">
          <MeetLinkForm
            appointment={a}
            getConflict={getLinkConflict}
            onSaved={(updated) => setLinkAdded(Boolean(updated.meetLink))}
          />
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