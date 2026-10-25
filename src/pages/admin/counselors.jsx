import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Plus, Search, Users, X } from "lucide-react";
import Button from "../../components/ui/button";
import Pagination from "../../components/ui/pagination";
import ConfirmDialog from "../../components/common/confirm-dialog";
import CounselorsTable from "../../features/admin/counselors-table";
import AddCounselorModal from "../../features/admin/add-counselor-modal";
import PasswordRevealModal from "../../features/admin/password-reveal-modal";
import useDebounce from "../../hooks/use-debounce";
import { getCounselors, resetCounselorPassword, setUserStatus } from "../../api/admin";
import { getErrorMessage } from "../../api/axios";

const PAGE_SIZE = 10;

export default function Counselors() {
  const [counselors, setCounselors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ search: "", page: 1 });
  const [reloadKey, setReloadKey] = useState(0);
  const debouncedSearch = useDebounce(search.trim(), 400);

  const [notice, setNotice] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [reveal, setReveal] = useState(null);

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

  // Load counselors whenever the search, the page, or a manual reload changes
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getCounselors({
          search: filters.search,
          page: filters.page,
          limit: PAGE_SIZE,
        });
        if (!cancelled) {
          setCounselors(data.items);
          setTotal(data.total);
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not load counselors."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [filters.search, filters.page, reloadKey]);

  const handleCreated = ({ counselor, password }) => {
    setAddOpen(false);
    setSearch("");
    setFilters({ search: "", page: 1 });
    reload();
    setReveal({
      title: "Counselor created",
      name: counselor.name,
      email: counselor.email,
      password,
    });
  };

  const handleConfirm = async () => {
    const { type, counselor } = confirm;

    try {
      setActionLoading(true);

      if (type === "status") {
        const updated = await setUserStatus(counselor.id, !counselor.isActive);
        setCounselors((prev) =>
          prev.map((c) => (c.id === counselor.id ? { ...c, isActive: updated.isActive } : c))
        );
        showNotice(
          "success",
          `${counselor.name} has been ${updated.isActive ? "activated" : "deactivated"}.`
        );
      } else {
        const { password } = await resetCounselorPassword(counselor.id);
        setReveal({
          title: "Password reset",
          name: counselor.name,
          email: counselor.email,
          password,
        });
      }
    } catch (err) {
      showNotice("error", getErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setActionLoading(false);
      setConfirm(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const initialLoad = loading && counselors.length === 0;

  const isStatus = confirm?.type === "status";
  const target = confirm?.counselor;
  const deactivating = isStatus && target?.isActive;

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
            <h2 className="text-lg font-bold text-blue-950">All counselors</h2>
            <p className="text-sm text-slate-500">
              {total} {total === 1 ? "counselor" : "counselors"}
              {filters.search ? ` matching "${filters.search}"` : ""}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className="w-full rounded-full border border-slate-200 bg-white/80 py-2.5 pl-10 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-64"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-950"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus size={16} /> Add counselor
            </Button>
          </div>
        </div>

        <div className="mt-5">
          {initialLoad ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
              <Loader2 size={18} className="animate-spin" /> Loading counselors...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <AlertCircle size={28} className="text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
              <Button size="sm" variant="outline" onClick={reload}>
                Try again
              </Button>
            </div>
          ) : counselors.length === 0 ? (
            filters.search ? (
              <p className="py-12 text-center text-sm text-slate-500">
                No counselors match "{filters.search}".
              </p>
            ) : (
              <div className="flex flex-col items-center gap-3 py-14 text-center">
                <Users size={32} className="text-indigo-400" />
                <p className="font-semibold text-blue-950">No counselors yet</p>
                <p className="text-sm text-slate-500">Add the first counselor to get started.</p>
                <Button size="sm" onClick={() => setAddOpen(true)}>
                  <Plus size={16} /> Add counselor
                </Button>
              </div>
            )
          ) : (
            <div className={`transition-opacity ${loading ? "opacity-60" : "opacity-100"}`}>
              <CounselorsTable
                counselors={counselors}
                onToggleStatus={(counselor) => setConfirm({ type: "status", counselor })}
                onResetPassword={(counselor) => setConfirm({ type: "reset", counselor })}
              />
            </div>
          )}
        </div>

        {!error && counselors.length > 0 && (
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        )}
      </section>

      <AddCounselorModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={handleCreated}
      />

      <ConfirmDialog
        open={!!confirm}
        title={
          isStatus ? (deactivating ? "Deactivate counselor?" : "Activate counselor?") : "Reset password?"
        }
        message={
          isStatus
            ? deactivating
              ? `This will deactivate ${target?.name}'s account and sign them out everywhere. You can activate it again at any time.`
              : `This will activate ${target?.name}'s account again.`
            : `A new temporary password will be generated for ${target?.name}, and they will be signed out everywhere.`
        }
        confirmLabel={isStatus ? (deactivating ? "Deactivate" : "Activate") : "Reset password"}
        danger={deactivating}
        loading={actionLoading}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />

      <PasswordRevealModal data={reveal} onDone={() => setReveal(null)} />
    </div>
  );
}