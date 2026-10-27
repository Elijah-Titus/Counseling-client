import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
} from "lucide-react";
import Button from "../../components/ui/button";
import ConfirmDialog from "../../components/common/confirm-dialog";
import { getAllAppointments, getClient, setUserStatus } from "../../api/admin";
import { getErrorMessage } from "../../api/axios";
import { formatLagosDate, formatLagosTime } from "../../utils/lagos-time";

const statusInfo = {
  AWAITING: { label: "Scheduled", style: "bg-indigo-100 text-indigo-700" },
  COMPLETED: { label: "Completed", style: "bg-emerald-100 text-emerald-700" },
  NO_SHOW: { label: "Missed", style: "bg-amber-100 text-amber-700" },
  CANCELLED: { label: "Cancelled", style: "bg-slate-200 text-slate-600" },
};

const formatDob = (value) =>
  new Date(`${value.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

function Field({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 text-sm ${value ? "font-semibold text-blue-950" : "text-slate-400"}`}>
        {value || "Not provided yet"}
      </p>
    </div>
  );
}

export default function ClientDetails() {
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [recent, setRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);

  const [notice, setNotice] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 5000);
  };

  // The client's profile
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError("");
        setNotFound(false);
        setLoading(true);
        const data = await getClient(id);
        if (!cancelled) setClient(data);
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status === 404) setNotFound(true);
          else setError(getErrorMessage(err, "Could not load this client."));
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

  // Their five most recent appointments
  useEffect(() => {
    let cancelled = false;

    getAllAppointments({ clientId: id, page: 1, limit: 5 })
      .then((data) => {
        if (!cancelled) setRecent(data.items);
      })
      .catch(() => {
        if (!cancelled) setRecent([]);
      })
      .finally(() => {
        if (!cancelled) setRecentLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleToggle = async () => {
    try {
      setActionLoading(true);
      const updated = await setUserStatus(client.id, !client.isActive);
      setClient((prev) => ({ ...prev, isActive: updated.isActive }));
      showNotice(
        "success",
        `${client.name} has been ${updated.isActive ? "activated" : "deactivated"}.`
      );
    } catch (err) {
      showNotice("error", getErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setActionLoading(false);
      setConfirmOpen(false);
    }
  };

  const backLink = (
    <Link
      to="/admin/clients"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline"
    >
      <ArrowLeft size={16} /> All clients
    </Link>
  );

  if (loading && !client) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500">
        <Loader2 size={18} className="animate-spin" /> Loading client...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-4">
        {backLink}
        <div className="rounded-3xl bg-white/70 p-10 text-center shadow-sm backdrop-blur">
          <p className="text-lg font-bold text-blue-950">Client not found</p>
          <p className="mt-1 text-sm text-slate-500">
            This client doesn't exist, or the link is wrong.
          </p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-4">
        {backLink}
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/70 p-10 text-center shadow-sm backdrop-blur">
          <AlertCircle size={28} className="text-red-500" />
          <p className="text-sm text-red-700">{error || "Could not load this client."}</p>
          <Button size="sm" variant="outline" onClick={() => setReloadKey((key) => key + 1)}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const appointmentsLink = `/admin/appointments?${new URLSearchParams({
    clientId: client.id,
    clientName: client.name,
  })}`;

  return (
    <div className="space-y-5">
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

      {/* Header */}
      <section className="rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            {client.avatar ? (
              <img
                src={client.avatar}
                alt={client.name}
                className="h-20 w-20 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-3xl font-extrabold text-indigo-700">
                {client.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-extrabold text-blue-950">{client.name}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    client.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {client.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Mail size={14} /> {client.email}
              </p>
              {client.phone && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <Phone size={14} /> {client.phone}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">Joined {formatLagosDate(client.createdAt)}</p>
            </div>
          </div>

          <Button
            size="sm"
            variant={client.isActive ? "danger" : "primary"}
            onClick={() => setConfirmOpen(true)}
          >
            {client.isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </section>

      {/* Profile */}
      <section className="rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
        <h3 className="text-lg font-bold text-blue-950">Profile</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Date of birth" value={client.dateOfBirth ? formatDob(client.dateOfBirth) : ""} />
          <Field label="Gender" value={client.gender ? capitalize(client.gender) : ""} />
          <Field
            label="Marital status"
            value={client.maritalStatus ? capitalize(client.maritalStatus) : ""}
          />
        </div>
      </section>

      {/* Recent appointments */}
      <section className="rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-blue-950">Recent appointments</h3>
          <Link
            to={appointmentsLink}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline"
          >
            <CalendarDays size={15} /> View all
          </Link>
        </div>

        <div className="mt-4">
          {recentLoading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
              <Loader2 size={16} className="animate-spin" /> Loading...
            </div>
          ) : recent.length === 0 ? (
            <p className="py-6 text-sm text-slate-500">No appointments for this client yet.</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((a) => {
                const badge = statusInfo[a.status] || statusInfo.AWAITING;
                return (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/80 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-blue-950">{a.topic}</p>
                      <p className="text-xs text-slate-500">
                        {a.counselor?.name} · {formatLagosDate(a.startAt)},{" "}
                        {formatLagosTime(a.startAt)} – {formatLagosTime(a.endAt)}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.style}`}>
                      {badge.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title={client.isActive ? "Deactivate client?" : "Activate client?"}
        message={
          client.isActive
            ? `This will deactivate ${client.name}'s account and sign them out everywhere.`
            : `This will activate ${client.name}'s account again.`
        }
        confirmLabel={client.isActive ? "Deactivate" : "Activate"}
        danger={client.isActive}
        loading={actionLoading}
        onConfirm={handleToggle}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}