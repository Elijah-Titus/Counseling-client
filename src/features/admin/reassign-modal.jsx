import { useEffect, useState } from "react";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import Modal from "../../components/ui/modal";
import Button from "../../components/ui/button";
import { getCounselors, reassignAppointment } from "../../api/admin";
import { getErrorMessage } from "../../api/axios";
import { formatLagosDate, formatLagosTime } from "../../utils/lagos-time";

export default function ReassignModal({
  appointmentId,
  startAt,
  endAt,
  currentCounselorId,
  onClose,
  onReassigned,
}) {
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [choice, setChoice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Every active counselor except the current one
  useEffect(() => {
    let cancelled = false;

    getCounselors({ page: 1, limit: 100 })
      .then((data) => {
        if (!cancelled) {
          setOptions(data.items.filter((c) => c.isActive && c.id !== currentCounselorId));
        }
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Could not load the counselors."));
      })
      .finally(() => {
        if (!cancelled) setLoadingOptions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentCounselorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!choice) {
      setError("Please choose a counselor.");
      return;
    }

    try {
      setSaving(true);
      const updated = await reassignAppointment(appointmentId, choice);
      onReassigned(updated);
    } catch (err) {
      setError(getErrorMessage(err, "Could not reassign this appointment. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open title="Reassign appointment" onClose={saving ? () => {} : onClose}>
      <p className="text-sm text-slate-600">
        {formatLagosDate(startAt)}, {formatLagosTime(startAt)} – {formatLagosTime(endAt)}{" "}
        <span className="text-xs text-slate-400">(Lagos time)</span>
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-indigo-50 p-3 text-xs leading-relaxed text-indigo-800">
        <Info size={15} className="mt-0.5 shrink-0" />
        <p>
          The new counselor must be free for the whole session and have no approved leave. The
          Meet link is cleared, so they add their own. The client and the new counselor are
          notified.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="reassign-counselor"
            className="mb-1.5 block text-sm font-semibold text-blue-950"
          >
            New counselor
          </label>

          {loadingOptions ? (
            <p className="flex items-center gap-2 py-2 text-sm text-slate-500">
              <Loader2 size={15} className="animate-spin" /> Loading counselors...
            </p>
          ) : options.length === 0 ? (
            <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
              There's no other active counselor to give this appointment to.
            </p>
          ) : (
            <select
              id="reassign-counselor"
              value={choice}
              onChange={(e) => {
                setChoice(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-blue-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">Select a counselor</option>
              {options.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving || options.length === 0}
            className="disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Reassigning...
              </>
            ) : (
              "Reassign"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}