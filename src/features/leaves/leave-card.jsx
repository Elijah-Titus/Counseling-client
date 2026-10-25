import { CalendarOff, Info } from "lucide-react";
import {
  formatLagosDate,
  formatLagosDateShort,
  formatLagosTime,
  toLagosDateString,
} from "../../utils/lagos-time";

const statusInfo = {
  PENDING: { label: "Pending", style: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Approved", style: "bg-emerald-100 text-emerald-700" },
  DECLINED: { label: "Declined", style: "bg-red-100 text-red-700" },
  CANCELLED: { label: "Cancelled", style: "bg-slate-200 text-slate-600" },
};

export default function LeaveCard({ leave, onCancel }) {
  const l = leave;
  const badge = statusInfo[l.status] || statusInfo.PENDING;

  const sameDay = toLagosDateString(l.startAt) === toLagosDateString(l.endAt);
  const period = sameDay
    ? `${formatLagosDateShort(l.startAt)} · ${formatLagosTime(l.startAt)} – ${formatLagosTime(l.endAt)}`
    : `${formatLagosDateShort(l.startAt)}, ${formatLagosTime(l.startAt)} → ${formatLagosDateShort(l.endAt)}, ${formatLagosTime(l.endAt)}`;

  // A pending request can always be withdrawn; approved leave only before it starts
  const canCancel =
    l.status === "PENDING" ||
    (l.status === "APPROVED" && Date.now() < new Date(l.startAt).getTime());

  return (
    <li className="rounded-2xl bg-white/80 p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
          <CalendarOff size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-blue-950">{period}</h3>
            <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${badge.style}`}>
              {badge.label}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-600">{l.reason}</p>
          <p className="mt-1 text-xs text-slate-400">
            Requested on {formatLagosDate(l.createdAt)} · Lagos time
          </p>
        </div>

        {canCancel && (
          <button
            onClick={() => onCancel(l)}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            Cancel
          </button>
        )}
      </div>

      {l.status === "DECLINED" && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs leading-relaxed text-red-700">
          <Info size={15} className="mt-0.5 shrink-0" />
          <p>
            An administrator declined this request. Please contact them for the reason, then
            send a new request with different dates if you still need time off.
          </p>
        </div>
      )}
    </li>
  );
}