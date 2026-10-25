import { useEffect, useState } from "react";
import { AlertCircle, CalendarX, CheckCircle2, Loader2 } from "lucide-react";
import Button from "../../components/ui/button";
import Pagination from "../../components/ui/pagination";
import CounselorAppointmentCard from "../../features/appointments/counselor-appointment-card";
import RescheduleModal from "../../features/appointments/reschedule-modal";
import { getAppointments } from "../../api/appointments";
import { getErrorMessage } from "../../api/axios";
import { formatLagosDate, formatLagosTime } from "../../utils/lagos-time";

const PAGE_SIZE = 10;

const tabs = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
];

export default function CounselorAppointments() {
  const [scope, setScope] = useState("upcoming");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [notice, setNotice] = useState(null);
  const [target, setTarget] = useState(null);

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
        setLoading(true);
        const data = await getAppointments({ scope, page, limit: PAGE_SIZE });
        if (!cancelled) {
          setItems(data.items);
          setTotal(data.total);
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not load your appointments."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [scope, page, reloadKey]);

  const changeTab = (value) => {
    setScope(value);
    setPage(1);
  };

  const handleRescheduled = (updated) => {
    setTarget(null);
    showNotice(
      "success",
      `Session moved to ${formatLagosDate(updated.startAt)} at ${formatLagosTime(updated.startAt)}. The client has been notified.`
    );
    reload();
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const initialLoad = loading && items.length === 0;

  return (
    <div className="space-y-5">
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

      <section className="rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur sm:p-6">
        <div className="inline-flex rounded-full bg-indigo-50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => changeTab(tab.value)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                scope === tab.value
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-indigo-700 hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {initialLoad ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
              <Loader2 size={18} className="animate-spin" /> Loading your appointments...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <AlertCircle size={28} className="text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
              <Button size="sm" variant="outline" onClick={reload}>
                Try again
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <CalendarX size={32} className="text-indigo-400" />
              <p className="font-semibold text-blue-950">
                {scope === "upcoming" ? "No upcoming sessions" : "No past sessions yet"}
              </p>
              {scope === "upcoming" && (
                <p className="text-sm text-slate-500">
                  New bookings are assigned to you automatically and will show up here.
                </p>
              )}
            </div>
          ) : (
            <ul className={`space-y-3 transition-opacity ${loading ? "opacity-60" : ""}`}>
              {items.map((appointment) => (
                <CounselorAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onReschedule={setTarget}
                />
              ))}
            </ul>
          )}
        </div>

        {!error && items.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </section>

      {target && (
        <RescheduleModal
          key={target.id}
          appointment={target}
          onClose={() => setTarget(null)}
          onRescheduled={handleRescheduled}
        />
      )}
    </div>
  );
}