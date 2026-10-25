import { Link } from "react-router-dom";
import { CalendarOff, ChevronRight, TriangleAlert } from "lucide-react";
import { leaveStatusInfo } from "../../utils/leave-status";
import { formatLagosDate, formatLagosPeriod } from "../../utils/lagos-time";

export default function AdminLeaveCard({ leave, onFilterCounselor }) {
  const l = leave;
  const badge = leaveStatusInfo[l.status] || leaveStatusInfo.PENDING;
  const isPending = l.status === "PENDING";
  const affected = l.affectedAppointments ?? 0;
  const blocked = l.unreplaceable ?? 0;

  return (
    <li className="rounded-2xl bg-white/80 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <CalendarOff size={22} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onFilterCounselor(l.counselor)}
                title="Show only this counselor's requests"
                className="font-bold text-blue-950 transition hover:text-indigo-600 hover:underline"
              >
                {l.counselor?.name}
              </button>
              <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${badge.style}`}>
                {badge.label}
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {formatLagosPeriod(l.startAt, l.endAt)}
            </p>
            <p className="mt-1 text-sm text-slate-500">{l.reason}</p>
            <p className="mt-1 text-xs text-slate-400">
              Requested on {formatLagosDate(l.createdAt)} · Lagos time
            </p>

            {isPending && affected > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {affected} {affected === 1 ? "appointment" : "appointments"} affected
                </span>
                {blocked > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    <TriangleAlert size={12} /> {blocked} can't be covered
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <Link
          to={`/admin/leave/${l.id}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
        >
          {isPending ? "Review" : "View"} <ChevronRight size={16} />
        </Link>
      </div>
    </li>
  );
}