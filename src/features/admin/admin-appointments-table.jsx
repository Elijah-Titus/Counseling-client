import { Fragment, useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { formatLagosDate, formatLagosTime, getLagosDateParts } from "../../utils/lagos-time";

const statusInfo = {
  AWAITING: { label: "Scheduled", style: "bg-indigo-100 text-indigo-700" },
  COMPLETED: { label: "Completed", style: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", style: "bg-slate-200 text-slate-600" },
};

const nameButton =
  "text-left font-semibold text-blue-950 transition hover:text-indigo-600 hover:underline";

export default function AdminAppointmentsTable({
  appointments,
  onFilterClient,
  onFilterCounselor,
}) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="border-b border-indigo-100 text-xs uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3 font-semibold">When</th>
            <th className="px-4 py-3 font-semibold">Client</th>
            <th className="px-4 py-3 font-semibold">Counselor</th>
            <th className="px-4 py-3 font-semibold">Topic</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>

        <tbody>
          {appointments.map((a) => {
            const { day, month, weekday } = getLagosDateParts(a.startAt);
            const badge = a.abandoned
              ? { label: "Missed", style: "bg-amber-100 text-amber-700" }
              : statusInfo[a.status] || statusInfo.AWAITING;
            const open = openId === a.id;

            return (
              <Fragment key={a.id}>
                <tr className="border-b border-indigo-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-blue-950">
                      {weekday}, {day} {month}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatLagosTime(a.startAt)} – {formatLagosTime(a.endAt)}
                    </p>
                    {a.originalStartAt && (
                      <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        Rescheduled
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => onFilterClient(a.client)}
                      title="Show only this client's appointments"
                      className={nameButton}
                    >
                      {a.client?.name}
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => onFilterCounselor(a.counselor)}
                      title="Show only this counselor's appointments"
                      className={nameButton}
                    >
                      {a.counselor?.name}
                    </button>
                  </td>

                  <td className="max-w-[200px] truncate px-4 py-3 text-slate-600">{a.topic}</td>

                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.style}`}>
                      {badge.label}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setOpenId(open ? null : a.id)}
                      aria-label={open ? "Hide details" : "Show details"}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-indigo-50"
                    >
                      <ChevronDown size={18} className={`transition ${open ? "rotate-180" : ""}`} />
                    </button>
                  </td>
                </tr>

                {open && (
                  <tr className="border-b border-indigo-50 bg-indigo-50/40">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Message from client
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {a.description}
                          </p>
                        </div>

                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <Lock size={12} /> Private notes
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {a.notes || "No notes for this session."}
                          </p>
                        </div>

                        <div className="space-y-1 text-sm text-slate-600">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            History
                          </p>
                          <p>Booked on {formatLagosDate(a.createdAt)}</p>
                          {a.originalStartAt && (
                            <p>
                              Originally {formatLagosDate(a.originalStartAt)} at{" "}
                              {formatLagosTime(a.originalStartAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}