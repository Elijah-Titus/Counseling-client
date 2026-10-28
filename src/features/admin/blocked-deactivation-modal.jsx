import { useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import Modal from "../../components/ui/modal";
import Button from "../../components/ui/button";
import ReassignModal from "./reassign-modal";
import { formatLagosDateShort, formatLagosTime } from "../../utils/lagos-time";

export default function BlockedDeactivationModal({
  counselor,
  message,
  items,
  retrying,
  onClose,
  onRetry,
}) {
  const [remaining, setRemaining] = useState(items);
  const [target, setTarget] = useState(null);

  const handleReassigned = () => {
    setRemaining((prev) => prev.filter((item) => item !== target));
    setTarget(null);
  };

  return (
    <>
      <Modal
        open
        title={`Can't deactivate ${counselor.name} yet`}
        dismissible={!target && !retrying}
        onClose={onClose}
      >
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          <TriangleAlert size={15} className="mt-0.5 shrink-0" />
          <p>
            {message ||
              "Some upcoming appointments have no other counselor free to take them."}{" "}
            Nothing was changed.
          </p>
        </div>

        {remaining.length === 0 ? (
          <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            Every appointment has been reassigned. You can deactivate {counselor.name} now.
          </p>
        ) : (
          <>
            <p className="mt-4 text-sm text-slate-600">
              Reassign each of these appointments to another counselor, then try again.
            </p>
            <ul className="mt-3 space-y-2">
              {remaining.map((item) => (
                <li
                  key={item.appointmentId ?? item.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/80 p-3"
                >
                  <span className="text-sm font-semibold text-blue-950">
                    {formatLagosDateShort(item.startAt)} · {formatLagosTime(item.startAt)} –{" "}
                    {formatLagosTime(item.endAt)}
                  </span>
                  <button
                    onClick={() => setTarget(item)}
                    className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Reassign
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={retrying}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={onRetry}
            disabled={retrying || remaining.length > 0}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            {retrying ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Deactivating...
              </>
            ) : (
              "Deactivate now"
            )}
          </Button>
        </div>
      </Modal>

      {target && (
        <ReassignModal
          appointmentId={target.appointmentId ?? target.id}
          startAt={target.startAt}
          endAt={target.endAt}
          currentCounselorId={counselor.id}
          onClose={() => setTarget(null)}
          onReassigned={handleReassigned}
        />
      )}
    </>
  );
}