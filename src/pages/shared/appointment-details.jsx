import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  History,
  Loader2,
  Lock,
} from "lucide-react";
import Button from "../../components/ui/button";
import ConfirmDialog from "../../components/common/confirm-dialog";
import RescheduleModal from "../../features/appointments/reschedule-modal";
import { cancelAppointment, getAppointment } from "../../api/appointments";
import { getErrorMessage } from "../../api/axios";
import { canStillCancel, formatLagosDate, formatLagosTime } from "../../utils/lagos-time";
import { getStoredUser } from "../../utils/token";
import { ROLES } from "../../utils/roles";

const statusInfo = {
  AWAITING: { label: "Scheduled", style: "bg-indigo-100 text-indigo-700" },
  COMPLETED: { label: "Completed", style: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", style: "bg-slate-200 text-slate-600" },
};

function Row({ label, children }) {
  return (
    <div className="flex flex-col gap-1 border-b border-indigo-100 py-3 last:border-0 sm:flex-row sm:justify-between sm:gap-6">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-blue-950 sm:text-right">{children}</dd>
    </div>
  );
}

export default function AppointmentDetails() {
  const { id } = useParams();
  const isCounselor = getStoredUser()?.role === ROLES.COUNSELOR;
  const backPath = isCounselor ? "/counselor/appointments" : "/dashboard/appointments";

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [notice, setNotice] = useState(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const reload = () => setReloadKey((key) => key + 1);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 5000);
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError("");
        setNotFound(false);
        setLoading(true);
        const data = await getAppointment(id);
        if (!cancelled) setAppointment(data);
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status === 404) setNotFound(true);
          else setError(getErrorMessage(err, "Could not load this appointment."));
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

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await cancelAppointment(appointment.id);
      showNotice("success", "Your session has been cancelled.");
    } catch (err) {
      showNotice("error", getErrorMessage(err, "Could not cancel this session."));
    } finally {
      setCancelling(false);
      setCancelOpen(false);
      reload();
    }
  };

  const backLink = (
    <Link
      to={backPath}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline"
    >
      <ArrowLeft size={16} /> All appointments
    </Link>
  );

  if (loading && !appointment) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500">
        <Loader2 size={18} className="animate-spin" /> Loading appointment...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-4">
        {backLink}
        <div className="rounded-3xl bg-white/70 p-10 text-center shadow-sm backdrop-blur">
          <p className="text-lg font-bold text-blue-950">Appointment not found</p>
          <p className="mt-1 text-sm text-slate-500">
            It may not exist, or it isn't one of your appointments.
          </p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="space-y-4">
        {backLink}
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/70 p-10 text-center shadow-sm backdrop-blur">
          <AlertCircle size={28} className="text-red-500" />
          <p className="text-sm text-red-700">{error || "Could not load this appointment."}</p>
          <Button size="sm" variant="outline" onClick={reload}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const a = appointment;
  const hours = Math.round((new Date(a.endAt) - new Date(a.startAt)) / 3600000);

  const badge = a.abandoned
    ? {
        label: isCounselor ? "Client didn't attend" : "Missed",
        style: "bg-amber-100 text-amber-700",
      }
    : statusInfo[a.status] || statusInfo.AWAITING;

  const isScheduled = a.status === "AWAITING" && !a.abandoned;
  const canCancel = !isCounselor && isScheduled && canStillCancel(a.startAt);
  const canReschedule =
    isCounselor && isScheduled && !a.originalStartAt && Date.now() < new Date(a.startAt).getTime();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {backLink}

      {notice && (
        <div
          role="status"
          className={`flex items-center gap-2 rounded-xl p-3 text-sm ${
            notice.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {notice.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {notice.text}
        </div>
      )}

      <section className="rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-extrabold text-blue-950">{a.topic}</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.style}`}>
            {badge.label}
          </span>
        </div>

        <dl className="mt-5">
          <Row label="Date">{formatLagosDate(a.startAt)}</Row>
          <Row label="Time">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} />
              {formatLagosTime(a.startAt)} – {formatLagosTime(a.endAt)} ({hours}{" "}
              {hours === 1 ? "hour" : "hours"}, Lagos time)
            </span>
          </Row>
          <Row label={isCounselor ? "Client" : "Counselor"}>
            {isCounselor ? a.client?.name : a.counselor?.name}
          </Row>
          <Row label="Booked on">{formatLagosDate(a.createdAt)}</Row>
        </dl>

        {a.originalStartAt && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
            <History size={15} className="mt-0.5 shrink-0" />
            <p>
              {isCounselor ? "You rescheduled this session." : "Your counselor rescheduled this session."}{" "}
              It was originally on {formatLagosDate(a.originalStartAt)} at{" "}
              {formatLagosTime(a.originalStartAt)}.
            </p>
          </div>
        )}

        {a.abandoned && (
          <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
            {isCounselor
              ? "The session ended without the client attending."
              : "You didn't attend this session. You can book a new one at any time."}
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          {isCounselor ? `Message from ${a.client?.name}` : "What you shared"}
        </h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
          {a.description}
        </p>
      </section>

      {isCounselor && (
        <section className="rounded-3xl bg-violet-50/70 p-6 shadow-sm sm:p-8">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-slate-500">
            <Lock size={14} /> Private notes
          </h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {a.notes || "No notes for this session yet."}
          </p>
        </section>
      )}

      {(canCancel || canReschedule || (!isCounselor && isScheduled)) && (
        <section className="flex flex-wrap items-center gap-3">
          {canCancel && (
            <Button variant="danger" onClick={() => setCancelOpen(true)}>
              Cancel session
            </Button>
          )}
          {canReschedule && (
            <Button onClick={() => setRescheduleOpen(true)}>Reschedule</Button>
          )}
          {!isCounselor && isScheduled && !canCancel && (
            <p className="text-sm text-slate-500">Cancellation is closed for this session.</p>
          )}
        </section>
      )}

      {isCounselor && isScheduled && a.originalStartAt && (
        <p className="text-sm text-slate-500">This session has already been rescheduled once.</p>
      )}

      <ConfirmDialog
        open={cancelOpen}
        title="Cancel this session?"
        message={`Your session "${a.topic}" on ${formatLagosDate(a.startAt)} at ${formatLagosTime(a.startAt)} will be cancelled and your counselor will be notified. This can't be undone, but you can book a new one.`}
        confirmLabel="Cancel session"
        danger
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setCancelOpen(false)}
      />

      {rescheduleOpen && (
        <RescheduleModal
          key={a.id}
          appointment={a}
          onClose={() => setRescheduleOpen(false)}
          onRescheduled={(updated) => {
            setRescheduleOpen(false);
            showNotice(
              "success",
              `Session moved to ${formatLagosDate(updated.startAt)} at ${formatLagosTime(updated.startAt)}. The client has been notified.`
            );
            reload();
          }}
        />
      )}
    </div>
  );
}