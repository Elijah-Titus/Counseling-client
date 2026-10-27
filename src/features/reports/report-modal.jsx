import { useEffect, useState } from "react";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import Modal from "../../components/ui/modal";
import Input from "../../components/ui/input";
import Textarea from "../../components/ui/textarea";
import Button from "../../components/ui/button";
import { getReport, saveReport } from "../../api/reports";
import { getServerError } from "../../utils/server-error";
import {
  formatLagosDate,
  formatLagosTime,
  toLagosDateString,
  toLagosTimeInput,
} from "../../utils/lagos-time";

const outcomes = [
  { value: "COMPLETED", label: "Session held" },
  { value: "NO_SHOW", label: "Client didn't attend" },
];

export default function ReportModal({ appointment, onClose, onSaved }) {
  const [loadingReport, setLoadingReport] = useState(true);
  const [outcome, setOutcome] = useState(
    appointment.status === "NO_SHOW" ? "NO_SHOW" : "COMPLETED"
  );
  const [summary, setSummary] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [needsFollowUp, setNeedsFollowUp] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const editing = appointment.status !== "AWAITING";
  const day = toLagosDateString(appointment.startAt);

  // Load any saved report first, so a correction starts from what is already there
  useEffect(() => {
    let cancelled = false;

    getReport(appointment.id)
      .then((data) => {
        const report = data.report;
        if (cancelled || !report) return;
        setSummary(report.summary || "");
        setRecommendation(report.recommendation || "");
        setNeedsFollowUp(Boolean(report.needsFollowUp));
        setStartTime(report.actualStartAt ? toLagosTimeInput(report.actualStartAt) : "");
        setEndTime(report.actualEndAt ? toLagosTimeInput(report.actualEndAt) : "");
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingReport(false);
      });

    return () => {
      cancelled = true;
    };
  }, [appointment.id]);

  const toIso = (time) => `${day}T${time}:00+01:00`;

  const validate = () => {
    const found = {};
    const text = summary.trim();

    if (outcome === "COMPLETED" && text.length < 1)
      found.summary = "Write a short summary of the session.";
    if (text.length > 5000) found.summary = "The summary can be at most 5000 characters.";

    if (outcome === "COMPLETED") {
      if (recommendation.trim().length > 2000)
        found.recommendation = "The recommendation can be at most 2000 characters.";

      const now = Date.now();
      if (startTime && new Date(toIso(startTime)).getTime() > now)
        found.times = "The actual start can't be in the future.";
      else if (endTime && new Date(toIso(endTime)).getTime() > now)
        found.times = "The actual end can't be in the future.";
      else if (startTime && endTime && new Date(toIso(endTime)) <= new Date(toIso(startTime)))
        found.times = "The end must be after the start.";
    }

    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const body = { outcome };
    if (summary.trim()) body.summary = summary.trim();

    if (outcome === "COMPLETED") {
      body.recommendation = recommendation.trim(); // an empty text clears it
      body.needsFollowUp = needsFollowUp;
      if (startTime) body.actualStartAt = toIso(startTime);
      if (endTime) body.actualEndAt = toIso(endTime);
    }

    try {
      setSaving(true);
      const result = await saveReport(appointment.id, body);
      onSaved(result);
    } catch (err) {
      setServerError(getServerError(err, "Could not save the outcome. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={editing ? "Edit session outcome" : "Record session outcome"}
      onClose={saving ? () => {} : onClose}
    >
      <p className="text-sm text-slate-600">
        <span className="font-semibold text-blue-950">{appointment.topic}</span> with{" "}
        {appointment.client?.name}
        <br />
        <span className="text-xs text-slate-500">
          {formatLagosDate(appointment.startAt)}, {formatLagosTime(appointment.startAt)} –{" "}
          {formatLagosTime(appointment.endAt)} (Lagos time)
        </span>
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-indigo-50 p-3 text-xs leading-relaxed text-indigo-800">
        <Info size={15} className="mt-0.5 shrink-0" />
        <p>
          Clients never see reports. Only you and administrators can. Saving closes this
          session's chat.
        </p>
      </div>

      {loadingReport ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
          <Loader2 size={18} className="animate-spin" /> Loading...
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{serverError}</p>
            </div>
          )}

          <div>
            <p className="mb-1.5 text-sm font-semibold text-blue-950">What happened?</p>
            <div className="grid grid-cols-2 gap-2">
              {outcomes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setOutcome(item.value);
                    setErrors({});
                  }}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                    outcome === item.value
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "border-slate-200 bg-white/80 text-blue-950 hover:border-indigo-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            id="report-summary"
            label={outcome === "COMPLETED" ? "Summary" : "Note (optional)"}
            rows={outcome === "COMPLETED" ? 5 : 3}
            maxLength={5000}
            placeholder={
              outcome === "COMPLETED"
                ? "What did you cover in the session?"
                : "Anything worth recording about the missed session"
            }
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              setErrors((prev) => ({ ...prev, summary: "" }));
            }}
            error={errors.summary}
          />

          {outcome === "COMPLETED" && (
            <>
              <Textarea
                id="report-recommendation"
                label="Recommendation (optional)"
                rows={3}
                maxLength={2000}
                placeholder="For example: Weekly follow-up sessions"
                value={recommendation}
                onChange={(e) => {
                  setRecommendation(e.target.value);
                  setErrors((prev) => ({ ...prev, recommendation: "" }));
                }}
                error={errors.recommendation}
              />

              <label className="flex items-center gap-2 text-sm font-semibold text-blue-950">
                <input
                  type="checkbox"
                  checked={needsFollowUp}
                  onChange={(e) => setNeedsFollowUp(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                />
                This client needs a follow-up
              </label>

              <div>
                <p className="mb-1.5 text-sm font-semibold text-blue-950">
                  Actual session time (optional)
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    id="report-start"
                    type="time"
                    label="Started at"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setErrors((prev) => ({ ...prev, times: "" }));
                    }}
                  />
                  <Input
                    id="report-end"
                    type="time"
                    label="Ended at"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setErrors((prev) => ({ ...prev, times: "" }));
                    }}
                  />
                </div>
                {errors.times && <p className="mt-1.5 text-xs text-red-600">{errors.times}</p>}
                <p className="mt-1.5 text-xs text-slate-400">
                  Lagos time, on the day of the session. Leave blank if it ran as booked.
                </p>
              </div>
            </>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                "Save outcome"
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}