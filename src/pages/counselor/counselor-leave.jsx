import { useEffect, useState } from "react";
import { AlertCircle, CalendarOff, CheckCircle2, Loader2, Plus, TriangleAlert } from "lucide-react";
import Button from "../../components/ui/button";
import Pagination from "../../components/ui/pagination";
import ConfirmDialog from "../../components/common/confirm-dialog";
import LeaveCard from "../../features/leaves/leave-card";
import RequestLeaveModal from "../../features/leaves/request-leave-modal";
import { cancelLeave, getMyLeaves } from "../../api/leaves";
import { getErrorMessage } from "../../api/axios";
import { formatLagosDateShort, formatLagosTime } from "../../utils/lagos-time";

const PAGE_SIZE = 10;

const tabs = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "DECLINED", label: "Declined" },
  { value: "CANCELLED", label: "Cancelled" },
];

const noticeStyles = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-800",
  error: "bg-red-50 text-red-700",
};

export default function CounselorLeave() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [notice, setNotice] = useState(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

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
        setLoading(true);
        const data = await getMyLeaves({ status, page, limit: PAGE_SIZE });
        if (!cancelled) {
          setItems(data.items);
          setTotal(data.total);
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not load your leave requests."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [status, page, reloadKey]);

  const changeTab = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleRequested = (leave) => {
    setRequestOpen(false);

    const affected = leave.affectedAppointments ?? 0;
    if (affected > 0) {
      showNotice(
        "warning",
        `Leave requested. ${affected} ${affected === 1 ? "appointment falls" : "appointments fall"} in this period. If approved, ${affected === 1 ? "it" : "they"} will be given to other counselors; if nobody is free, the request will be refused.`
      );
    } else {
      showNotice("success", "Leave requested. It will take effect once an administrator approves it.");
    }

    setStatus("");
    setPage(1);
    reload();
  };

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await cancelLeave(cancelTarget.id);
      showNotice("success", "Your leave has been cancelled.");
    } catch (err) {
      showNotice(
        "error",
        getErrorMessage(err, "This leave can no longer be cancelled. The list has been refreshed.")
      );
    } finally {
      setCancelling(false);
      setCancelTarget(null);
      reload();
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const initialLoad = loading && items.length === 0;

  return (
    <div className="space-y-5">
      {notice && (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-xl p-3 text-sm leading-relaxed ${noticeStyles[notice.type]}`}
        >
          {notice.type === "success" && <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
          {notice.type === "warning" && <TriangleAlert size={18} className="mt-0.5 shrink-0" />}
          {notice.type === "error" && <AlertCircle size={18} className="mt-0.5 shrink-0" />}
          <p>{notice.text}</p>
        </div>
      )}

      <section className="rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1 rounded-full bg-indigo-50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => changeTab(tab.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  status === tab.value
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-indigo-700 hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Button size="sm" onClick={() => setRequestOpen(true)}>
            <Plus size={16} /> Request leave
          </Button>
        </div>

        <div className="mt-5">
          {initialLoad ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
              <Loader2 size={18} className="animate-spin" /> Loading your leave requests...
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
              <CalendarOff size={32} className="text-indigo-400" />
              <p className="font-semibold text-blue-950">
                {status ? "No leave requests with this status" : "No leave requests yet"}
              </p>
              {!status && (
                <>
                  <p className="text-sm text-slate-500">
                    Need time off? Send a request and an administrator will review it.
                  </p>
                  <Button size="sm" onClick={() => setRequestOpen(true)}>
                    <Plus size={16} /> Request leave
                  </Button>
                </>
              )}
            </div>
          ) : (
            <ul className={`space-y-3 transition-opacity ${loading ? "opacity-60" : ""}`}>
              {items.map((leave) => (
                <LeaveCard key={leave.id} leave={leave} onCancel={setCancelTarget} />
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

      {requestOpen && (
        <RequestLeaveModal onClose={() => setRequestOpen(false)} onRequested={handleRequested} />
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        title="Withdraw this request?"
        message={
          cancelTarget
            ? `Your leave request for ${formatLagosDateShort(cancelTarget.startAt)}, ${formatLagosTime(cancelTarget.startAt)} will be withdrawn.`
            : ""
        }
        confirmLabel="Withdraw request"
        danger
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}