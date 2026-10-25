import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, CalendarCheck, CalendarOff, Loader2, X } from "lucide-react";
import Button from "../../components/ui/button";
import Pagination from "../../components/ui/pagination";
import AdminLeaveCard from "../../features/admin/admin-leave-card";
import { getAdminLeaves } from "../../api/admin";
import { getErrorMessage } from "../../api/axios";

const PAGE_SIZE = 10;

const tabs = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "DECLINED", label: "Declined" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "", label: "All" },
];

export default function LeaveRequests() {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => {
    const counselorId = searchParams.get("counselorId");
    return {
      status: "PENDING",
      counselor: counselorId
        ? { id: counselorId, name: searchParams.get("counselorName") || "Selected counselor" }
        : null,
      page: 1,
    };
  });
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => setReloadKey((key) => key + 1);

  // Any filter change goes back to page 1
  const updateFilters = (patch) => setFilters((prev) => ({ ...prev, ...patch, page: 1 }));

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getAdminLeaves({
          status: filters.status,
          counselorId: filters.counselor?.id,
          page: filters.page,
          limit: PAGE_SIZE,
        });
        if (!cancelled) {
          setItems(data.items);
          setTotal(data.total);
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not load leave requests."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [filters, reloadKey]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const initialLoad = loading && items.length === 0;
  const caughtUp = filters.status === "PENDING" && !filters.counselor;

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur sm:p-6">
        <div className="flex flex-wrap gap-1 rounded-full bg-indigo-50 p-1 sm:inline-flex">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => updateFilters({ status: tab.value })}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filters.status === tab.value
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-indigo-700 hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filters.counselor && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              Counselor: {filters.counselor.name}
              <button
                onClick={() => updateFilters({ counselor: null })}
                aria-label="Remove counselor filter"
                className="transition hover:text-indigo-900"
              >
                <X size={13} />
              </button>
            </span>
          </div>
        )}

        <p className="mt-4 text-sm text-slate-500">
          {total} {total === 1 ? "request" : "requests"}
        </p>

        <div className="mt-3">
          {initialLoad ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
              <Loader2 size={18} className="animate-spin" /> Loading leave requests...
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
              {caughtUp ? (
                <CalendarCheck size={32} className="text-emerald-500" />
              ) : (
                <CalendarOff size={32} className="text-indigo-400" />
              )}
              <p className="font-semibold text-blue-950">
                {caughtUp ? "You're all caught up" : "No leave requests match"}
              </p>
              <p className="text-sm text-slate-500">
                {caughtUp
                  ? "There are no pending requests waiting for a decision."
                  : "Try another status, or remove the counselor filter."}
              </p>
            </div>
          ) : (
            <ul className={`space-y-3 transition-opacity ${loading ? "opacity-60" : ""}`}>
              {items.map((leave) => (
                <AdminLeaveCard
                  key={leave.id}
                  leave={leave}
                  onFilterCounselor={(counselor) => updateFilters({ counselor })}
                />
              ))}
            </ul>
          )}
        </div>

        {!error && items.length > 0 && (
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        )}
      </section>
    </div>
  );
}