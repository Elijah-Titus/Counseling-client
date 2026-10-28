import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { getReport } from "../../api/reports";
import { getErrorMessage } from "../../api/axios";
import { formatLagosDate, formatLagosTime } from "../../utils/lagos-time";

export default function ReportPanel({
  appointmentId,
  status,
  refreshKey = 0,
  onEdit,
  onFollowUp,
  compact,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError("");
        setLoading(true);
        const result = await getReport(appointmentId);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not load the report."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [appointmentId, refreshKey]);

  const report = data?.report;

  return (
    <section
      className={compact ? "rounded-xl bg-white/70 p-4" : "rounded-3xl bg-violet-50/70 p-6 sm:p-8"}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-slate-500">
          <Lock size={14} /> Session report
        </h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      <div className="mt-3">
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 size={15} className="animate-spin" /> Loading...
          </p>
        ) : error ? (
          <p className="flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={15} /> {error}
          </p>
        ) : !report ? (
          <p className="text-sm text-slate-500">
            {status === "NO_SHOW"
              ? "Marked as: the client didn't attend. No report was written."
              : "No report has been written for this session yet."}
          </p>
        ) : (
          <div className="space-y-3">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {report.summary}
            </p>

            {report.recommendation && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Recommendation
                </p>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {report.recommendation}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {report.needsFollowUp && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Follow-up recommended
                </span>
              )}
              {onFollowUp && status === "COMPLETED" && report.needsFollowUp && (
                <button
                  onClick={onFollowUp}
                  className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Schedule follow-up
                </button>
              )}
              {report.actualStartAt && report.actualEndAt && (
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                  Actual time {formatLagosTime(report.actualStartAt)} –{" "}
                  {formatLagosTime(report.actualEndAt)}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Last updated {formatLagosDate(report.updatedAt)}
            </p>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {onEdit
          ? "Only you and administrators can see this report."
          : "Only the counselor and administrators can see this report."}
      </p>
    </section>
  );
}