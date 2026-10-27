import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import Button from "../../components/ui/button";
import ConfirmDialog from "../../components/common/confirm-dialog";
import DeclineLeaveModal from "../../features/admin/decline-leave-modal";
import { decideLeave, getAdminLeave } from "../../api/admin";
import { getErrorMessage } from "../../api/axios";
import { leaveStatusInfo } from "../../utils/leave-status";
import {
  formatLagosDate,
  formatLagosDateShort,
  formatLagosPeriod,
  formatLagosTime,
} from "../../utils/lagos-time";

// A ready-made explanation for the counselor when some appointments can't be covered
const suggestNote = (items) => {
  if (!items || items.length === 0) return "";

  const first = items[0];
  const when = `${formatLagosDateShort(first.startAt)} at ${formatLagosTime(first.startAt)}`;
  const text =
    items.length === 1
      ? `The appointment on ${when} cannot be covered.`
      : `${items.length} appointments cannot be covered, starting ${when}.`;

  return `${text} Please change your dates.`;
};

export default function LeaveDetails() {
  const { id } = useParams();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [notice, setNotice] = useState(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [acting, setActing] = useState(false);
  const [blocked, setBlocked] = useState(null);

  const reload = () => setReloadKey((key) => key + 1);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 9000);
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError("");
        setNotFound(false);
        setLoading(true);
        const data = await getAdminLeave(id);
        if (!cancelled) setLeave(data);
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status === 404) setNotFound(true);
          else setError(getErrorMessage(err, "Could not load this leave request."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  const handleDecision = async (status, note) => {
    try {
      setActing(true);
      const result = await decideLeave(id, { status, note });
      setBlocked(null);

      if (status === "APPROVED") {
        const moved = result.reassigned ?? 0;
        showNotice(
          "success",
          moved > 0
            ? `Leave approved. ${moved} ${moved === 1 ? "appointment was" : "appointments were"} given to other counselors.`
            : "Leave approved. No appointments needed to be moved."
        );
      } else {
        showNotice("success", "Leave declined. The counselor has been notified.");
      }

      reload();
    } catch (err) {
      const code = err.response?.status;
      const data = err.response?.data;

      if (code === 409 && data?.errors?.blocked) {
        // Nobody is free to take some appointments: nothing was changed
        setBlocked({ message: data.message, items: data.errors.blocked });
      } else {
        showNotice("error", getErrorMessage(err, "Could not save your decision. Please try again."));
      }

      // Already decided, already started, or changed while approving: show the current state
      if (code === 409 || code === 404) reload();
    } finally {
      setActing(false);
      setApproveOpen(false);
      setDeclineOpen(false);
    }
  };

  const backLink = (
    <Link
      to="/admin/leave"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline"
    >
      <ArrowLeft size={16} /> All leave requests
    </Link>
  );

  if (loading && !leave) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500">
        <Loader2 size={18} className="animate-spin" /> Loading leave request...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-4">
        {backLink}
        <div className="rounded-3xl bg-white/70 p-10 text-center shadow-sm backdrop-blur">
          <p className="text-lg font-bold text-blue-950">Leave request not found</p>
          <p className="mt-1 text-sm text-slate-500">It doesn't exist, or the link is wrong.</p>
        </div>
      </div>
    );
  }

  if (error || !leave) {
    return (
      <div className="space-y-4">
        {backLink}
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/70 p-10 text-center shadow-sm backdrop-blur">
          <AlertCircle size={28} className="text-red-500" />
          <p className="text-sm text-red-700">{error || "Could not load this leave request."}</p>
          <Button size="sm" variant="outline" onClick={reload}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const badge = leaveStatusInfo[leave.status] || leaveStatusInfo.PENDING;
  const isPending = leave.status === "PENDING";
  const affected = leave.affectedAppointments ?? 0;
  const unreplaceable = leave.unreplaceable ?? 0;
  const appointments = leave.appointments ?? [];
  const uncovered = appointments.filter((a) => !a.canBeReassigned);
  const started = Date.now() >= new Date(leave.startAt).getTime();
  const approveDisabled = unreplaceable > 0 || started;
  const declineSuggestion = suggestNote(blocked?.items?.length ? blocked.items : uncovered);

  const appointmentLink = (clientId) =>
    `/admin/appointments?${new URLSearchParams({
      counselorId: leave.counselor.id,
      counselorName: leave.counselor.name,
      clientId,
    })}`;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {backLink}

      {notice && (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-xl p-3 text-sm leading-relaxed ${
            notice.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {notice.type === "success" ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          )}
          <p>{notice.text}</p>
        </div>
      )}

      {/* The request */}
      <section className="rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/admin/counselors/${leave.counselor?.id}`}
            className="text-2xl font-extrabold text-blue-950 transition hover:text-indigo-600 hover:underline"
          >
            {leave.counselor?.name}
          </Link>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.style}`}>
            {badge.label}
          </span>
        </div>

        <p className="mt-3 font-semibold text-slate-700">
          {formatLagosPeriod(leave.startAt, leave.endAt)}
        </p>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
          {leave.reason}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Requested on {formatLagosDate(leave.createdAt)} · Lagos time
        </p>

        {isPending && (
          <div className="mt-6 space-y-3">
            {started ? (
              <p className="rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                This leave has already started, so it can only be declined.
              </p>
            ) : (
              unreplaceable > 0 && (
                <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                  <TriangleAlert size={15} className="mt-0.5 shrink-0" />
                  <span>
                    {unreplaceable} {unreplaceable === 1 ? "appointment has" : "appointments have"} no
                    other counselor free, so approving would be refused. Decline with a note asking{" "}
                    {leave.counselor?.name} to change the dates.
                  </span>
                </p>
              )
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setApproveOpen(true)}
                disabled={approveDisabled}
                className="disabled:cursor-not-allowed disabled:opacity-50"
              >
                Approve
              </Button>
              <Button variant="danger" onClick={() => setDeclineOpen(true)}>
                Decline
              </Button>
              <Button variant="outline" onClick={reload}>
                Refresh
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* A refused approval */}
      {blocked && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <p className="flex items-start gap-2 text-sm font-semibold text-red-700">
            <TriangleAlert size={18} className="mt-0.5 shrink-0" />
            {blocked.message || "The approval was refused. Nothing was changed."}
          </p>
          <ul className="mt-3 space-y-2">
            {blocked.items.map((item) => (
              <li
                key={item.appointmentId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/80 p-3 text-sm"
              >
                <span className="font-semibold text-blue-950">
                  {formatLagosDateShort(item.startAt)} · {formatLagosTime(item.startAt)} –{" "}
                  {formatLagosTime(item.endAt)}
                </span>
                <Link
                  to={appointmentLink(item.clientId)}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  View appointment
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-red-700">
            Nothing was changed. You can decline the request with a note, so the counselor can
            choose different dates.
          </p>
        </section>
      )}

      {/* What the leave would uncover (pending only) */}
      {isPending && (
        <section className="rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
          <h3 className="text-lg font-bold text-blue-950">Appointments in this period</h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-indigo-50 p-4">
              <p className="text-3xl font-extrabold text-indigo-700">{affected}</p>
              <p className="text-sm text-slate-600">Appointments affected</p>
            </div>
            <div className={`rounded-2xl p-4 ${unreplaceable > 0 ? "bg-red-50" : "bg-emerald-50"}`}>
              <p
                className={`text-3xl font-extrabold ${
                  unreplaceable > 0 ? "text-red-700" : "text-emerald-700"
                }`}
              >
                {unreplaceable}
              </p>
              <p className="text-sm text-slate-600">Can't be covered</p>
            </div>
          </div>

          {appointments.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No appointments fall in this period, so approving moves nothing.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {appointments.map((a) => (
                <li
                  key={a.appointmentId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-blue-950">
                      {formatLagosDateShort(a.startAt)} · {formatLagosTime(a.startAt)} –{" "}
                      {formatLagosTime(a.endAt)}
                    </p>
                    <Link
                      to={appointmentLink(a.clientId)}
                      className="inline-flex items-center gap-0.5 text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      View appointment <ChevronRight size={13} />
                    </Link>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      a.canBeReassigned
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.canBeReassigned ? "Can be reassigned" : "No one free"}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            This is a preview. The replacement counselor is chosen at the moment you approve.
          </p>
        </section>
      )}

      <ConfirmDialog
        open={approveOpen}
        title="Approve this leave?"
        message={
        affected > 0
          ? `${leave.counselor?.name} will be unavailable for this period, and ${affected} ${affected === 1 ? "appointment" : "appointments"} will be given to other counselors. They won't return to ${leave.counselor?.name}.`
          : `${leave.counselor?.name} will be unavailable for this period. No appointments need to be moved.`
        }
        confirmLabel="Approve leave"
        loading={acting}
        onConfirm={() => handleDecision("APPROVED")}
        onCancel={() => setApproveOpen(false)}
      />

      {declineOpen && (
        <DeclineLeaveModal
          counselorName={leave.counselor?.name}
          initialNote={declineSuggestion}
          loading={acting}
          onSubmit={(note) => handleDecision("DECLINED", note)}
          onClose={() => setDeclineOpen(false)}
        />
      )}
    </div>
  );
}