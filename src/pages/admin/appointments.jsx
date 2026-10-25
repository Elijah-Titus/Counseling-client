import { useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarCheck,
  CalendarX,
  CheckCircle2,
  Loader2,
  RefreshCw,
  UserX,
  X,
} from "lucide-react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import Pagination from "../../components/ui/pagination";
import AdminAppointmentsTable from "../../features/admin/admin-appointments-table";
import { getAllAppointments, getAppointmentCounts } from "../../api/admin";
import { getErrorMessage } from "../../api/axios";
import { addDaysToDateString, lagosDayStartUtc } from "../../utils/lagos-time";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 10;

const stats = [
  { view: "upcoming", label: "Upcoming", icon: CalendarCheck, tone: "bg-indigo-100 text-indigo-600" },
  { view: "missed", label: "Missed", icon: UserX, tone: "bg-amber-100 text-amber-600" },
  { view: "completed", label: "Completed", icon: CheckCircle2, tone: "bg-emerald-100 text-emerald-600" },
  { view: "cancelled", label: "Cancelled", icon: CalendarX, tone: "bg-slate-200 text-slate-600" },
];

const viewLabels = Object.fromEntries(stats.map((s) => [s.view, s.label]));

const emptyFilters = { view: "", counselor: null, client: null, from: "", to: "", page: 1 };

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="transition hover:text-indigo-900"
      >
        <X size={13} />
      </button>
    </span>
  );
}

export default function AdminAppointments() {
  const [searchParams] = useSearchParams();
const [filters, setFilters] = useState(() => {
  const counselorId = searchParams.get("counselorId");
  if (!counselorId) return emptyFilters;

  return {
    ...emptyFilters,
    counselor: {
      id: counselorId,
      name: searchParams.get("counselorName") || "Selected counselor",
    },
  };
});
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => setReloadKey((key) => key + 1);

  // Any filter change goes back to page 1
  const updateFilters = (patch) => setFilters((prev) => ({ ...prev, ...patch, page: 1 }));

  const hasFilters = Boolean(
    filters.view || filters.counselor || filters.client || filters.from || filters.to
  );
  const rangeInvalid = Boolean(filters.from && filters.to && filters.from > filters.to);

  // The list
  useEffect(() => {
    if (rangeInvalid) {
      setItems([]);
      setTotal(0);
      setError("");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getAllAppointments({
          view: filters.view,
          counselorId: filters.counselor?.id,
          clientId: filters.client?.id,
          from: filters.from ? lagosDayStartUtc(filters.from) : undefined,
          to: filters.to ? lagosDayStartUtc(addDaysToDateString(filters.to, 1)) : undefined,
          page: filters.page,
          limit: PAGE_SIZE,
        });
        if (!cancelled) {
          setItems(data.items);
          setTotal(data.total);
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not load appointments."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [filters, reloadKey, rangeInvalid]);

  // The four counts on the cards (not affected by the filters)
  useEffect(() => {
    let cancelled = false;

    getAppointmentCounts()
      .then((data) => {
        if (!cancelled) setCounts(data);
      })
      .catch(() => {
        if (!cancelled) setCounts(null);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const initialLoad = loading && items.length === 0;

  return (
    <div className="space-y-5">
      {/* Count cards, also quick filters */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ view, label, icon: Icon, tone }) => {
          const active = filters.view === view;
          return (
            <button
              key={view}
              onClick={() => updateFilters({ view: active ? "" : view })}
              aria-pressed={active}
              className={`rounded-2xl bg-white/70 p-5 text-left shadow-sm backdrop-blur transition hover:bg-white ${
                active ? "ring-2 ring-indigo-500" : ""
              }`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${tone}`}>
                <Icon size={22} />
              </div>
              <p className="mt-4 text-3xl font-extrabold text-blue-950">{counts?.[view] ?? "–"}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </button>
          );
        })}
      </section>

      <section className="rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-4 sm:grid-cols-2 lg:w-[28rem]">
            <Input
              id="from"
              type="date"
              label="From"
              value={filters.from}
              onChange={(e) => updateFilters({ from: e.target.value })}
            />
            <Input
              id="to"
              type="date"
              label="To"
              value={filters.to}
              onChange={(e) => updateFilters({ to: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={reload}>
              <RefreshCw size={15} /> Refresh
            </Button>
            {hasFilters && (
              <Button size="sm" variant="outline" onClick={() => setFilters(emptyFilters)}>
                Clear filters
              </Button>
            )}
          </div>
        </div>

        <p className="mt-2 text-xs text-slate-500">Dates are in Lagos time.</p>

        {rangeInvalid && (
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
            The "From" date can't be after the "To" date.
          </p>
        )}

        {(filters.view || filters.counselor || filters.client) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {filters.view && (
              <FilterChip label={viewLabels[filters.view]} onRemove={() => updateFilters({ view: "" })} />
            )}
            {filters.counselor && (
              <FilterChip
                label={`Counselor: ${filters.counselor.name}`}
                onRemove={() => updateFilters({ counselor: null })}
              />
            )}
            {filters.client && (
              <FilterChip
                label={`Client: ${filters.client.name}`}
                onRemove={() => updateFilters({ client: null })}
              />
            )}
          </div>
        )}

        <p className="mt-4 text-sm text-slate-500">
          {total} {total === 1 ? "appointment" : "appointments"}
          {hasFilters ? " match your filters" : " in total"}
        </p>

        <div className="mt-3">
          {initialLoad ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
              <Loader2 size={18} className="animate-spin" /> Loading appointments...
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
                {hasFilters ? "No appointments match these filters" : "No appointments yet"}
              </p>
              {hasFilters && !rangeInvalid && (
                <Button size="sm" variant="outline" onClick={() => setFilters(emptyFilters)}>
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className={`transition-opacity ${loading ? "opacity-60" : "opacity-100"}`}>
              <AdminAppointmentsTable
                appointments={items}
                onFilterClient={(client) => updateFilters({ client })}
                onFilterCounselor={(counselor) => updateFilters({ counselor })}
              />
            </div>
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