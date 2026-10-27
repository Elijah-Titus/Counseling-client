import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Search, UserRound, X } from "lucide-react";
import Button from "../../components/ui/button";
import Pagination from "../../components/ui/pagination";
import ConfirmDialog from "../../components/common/confirm-dialog";
import ClientsTable from "../../features/admin/clients-table";
import useDebounce from "../../hooks/use-debounce";
import { getClients, setUserStatus } from "../../api/admin";
import { getErrorMessage } from "../../api/axios";

const PAGE_SIZE = 10;

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ search: "", page: 1 });
  const [reloadKey, setReloadKey] = useState(0);
  const debouncedSearch = useDebounce(search.trim(), 400);

  const [notice, setNotice] = useState(null);
  const [confirm, setConfirm] = useState(null); // the client being (de)activated
  const [actionLoading, setActionLoading] = useState(false);

  const reload = () => setReloadKey((key) => key + 1);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 5000);
  };

  // When the typed search settles, apply it and go back to page 1
  useEffect(() => {
    setFilters((prev) =>
      prev.search === debouncedSearch ? prev : { search: debouncedSearch, page: 1 }
    );
  }, [debouncedSearch]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getClients({
          search: filters.search,
          page: filters.page,
          limit: PAGE_SIZE,
        });
        if (!cancelled) {
          setClients(data.items);
          setTotal(data.total);
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not load clients."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [filters.search, filters.page, reloadKey]);

  const handleConfirm = async () => {
    const client = confirm;
    try {
      setActionLoading(true);
      const updated = await setUserStatus(client.id, !client.isActive);
      setClients((prev) =>
        prev.map((c) => (c.id === client.id ? { ...c, isActive: updated.isActive } : c))
      );
      showNotice(
        "success",
        `${client.name} has been ${updated.isActive ? "activated" : "deactivated"}.`
      );
    } catch (err) {
      showNotice("error", getErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setActionLoading(false);
      setConfirm(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const initialLoad = loading && clients.length === 0;
  const deactivating = confirm?.isActive;

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-blue-950">All clients</h2>
            <p className="text-sm text-slate-500">
              {total} {total === 1 ? "client" : "clients"}
              {filters.search ? ` matching "${filters.search}"` : ""}
            </p>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-9 text-sm text-blue-950 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:w-72"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-5">
          {initialLoad ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
              <Loader2 size={18} className="animate-spin" /> Loading clients...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <AlertCircle size={28} className="text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
              <Button size="sm" variant="outline" onClick={reload}>
                Try again
              </Button>
            </div>
          ) : clients.length === 0 ? (
            filters.search ? (
              <p className="py-12 text-center text-sm text-slate-500">
                No clients match "{filters.search}".
              </p>
            ) : (
              <div className="flex flex-col items-center gap-3 py-14 text-center">
                <UserRound size={32} className="text-indigo-400" />
                <p className="font-semibold text-blue-950">No clients yet</p>
                <p className="text-sm text-slate-500">Clients appear here once they sign up.</p>
              </div>
            )
          ) : (
            <div className={`transition-opacity ${loading ? "opacity-60" : "opacity-100"}`}>
              <ClientsTable clients={clients} onToggleStatus={(client) => setConfirm(client)} />
            </div>
          )}
        </div>

        {!error && clients.length > 0 && (
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        )}
      </section>

      <ConfirmDialog
        open={!!confirm}
        title={deactivating ? "Deactivate client?" : "Activate client?"}
        message={
          deactivating
            ? `This will deactivate ${confirm?.name}'s account and sign them out everywhere.`
            : `This will activate ${confirm?.name}'s account again.`
        }
        confirmLabel={deactivating ? "Deactivate" : "Activate"}
        danger={deactivating}
        loading={actionLoading}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}