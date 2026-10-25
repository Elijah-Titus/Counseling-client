import { useState } from "react";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import Modal from "../../components/ui/modal";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { rescheduleAppointment } from "../../api/appointments";
import { getErrorMessage } from "../../api/axios";
import {
  formatLagosDate,
  formatLagosTime,
  getLagosHour,
  getLagosToday,
  toLagosDateString,
  toLagosIso,
} from "../../utils/lagos-time";

const formatHour = (hour) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:00 ${suffix}`;
};

export default function RescheduleModal({ appointment, onClose, onRescheduled }) {
  const duration = Math.round(
    (new Date(appointment.endAt) - new Date(appointment.startAt)) / 3600000
  );
  const today = getLagosToday();

  const [date, setDate] = useState(() => {
    const current = toLagosDateString(appointment.startAt);
    return current < today ? today : current;
  });
  const [hour, setHour] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sessions must start on the hour and end by 5:00 PM, so the last start depends on the length
  const lastStart = 17 - duration;
  const nowHour = getLagosHour();
  const hourOptions = [];
  for (let h = 9; h <= lastStart; h++) {
    if (date === today && h <= nowHour) continue;
    hourOptions.push(h);
  }

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setHour("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date || date < today) {
      setError("Please pick today or a later date.");
      return;
    }
    if (hour === "") {
      setError("Please choose a new start time.");
      return;
    }

    try {
      setLoading(true);
      const updated = await rescheduleAppointment(appointment.id, toLagosIso(date, Number(hour)));
      onRescheduled(updated);
    } catch (err) {
      setError(getErrorMessage(err, "Could not reschedule this session. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open title="Reschedule session" onClose={loading ? () => {} : onClose}>
      <p className="text-sm text-slate-600">
        <span className="font-semibold text-blue-950">{appointment.topic}</span> with{" "}
        {appointment.client?.name}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Currently {formatLagosDate(appointment.startAt)}, {formatLagosTime(appointment.startAt)} –{" "}
        {formatLagosTime(appointment.endAt)} ({duration} {duration === 1 ? "hour" : "hours"})
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
        <Info size={15} className="mt-0.5 shrink-0" />
        <p>A session can only be rescheduled once, and the client will be notified.</p>
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

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <Input
          id="new-date"
          type="date"
          label="New date"
          min={today}
          value={date}
          onChange={handleDateChange}
        />

        <div>
          <label htmlFor="new-time" className="mb-1.5 block text-sm font-semibold text-blue-950">
            New start time (Lagos time)
          </label>
          <select
            id="new-time"
            value={hour}
            onChange={(e) => {
              setHour(e.target.value);
              setError("");
            }}
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-blue-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="">Select a time</option>
            {hourOptions.map((h) => (
              <option key={h} value={h}>
                {formatHour(h)} – {formatHour(h + duration)}
              </option>
            ))}
          </select>
          {hourOptions.length === 0 && (
            <p className="mt-1.5 text-xs text-amber-700">
              No start times are left on this date. Please pick another date.
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Rescheduling...
              </>
            ) : (
              "Reschedule"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}