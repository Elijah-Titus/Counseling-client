import { useState } from "react";
import { AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";
import Modal from "../../components/ui/modal";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { createFollowUp } from "../../api/appointments";
import { getServerError } from "../../utils/server-error";
import {
  formatLagosDate,
  formatLagosTime,
  getLagosTomorrow,
  toLagosIso,
} from "../../utils/lagos-time";

const formatHour = (hour) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:00 ${suffix}`;
};

export default function FollowUpModal({ appointment, onClose, onCreated }) {
  const tomorrow = getLagosTomorrow();
  const previousHours = Math.round(
    (new Date(appointment.endAt) - new Date(appointment.startAt)) / 3600000
  );

  const [date, setDate] = useState(tomorrow);
  const [hours, setHours] = useState(
    Math.min(Math.max(previousHours, 1), 4)
  );
  const [hour, setHour] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);

  // Sessions run 9:00 AM to 5:00 PM, on the hour
  const hourOptions = [];
  for (let h = 9; h <= 17 - hours; h++) hourOptions.push(h);

  const handleHoursChange = (e) => {
    setHours(Number(e.target.value));
    setHour(""); // the valid start times change with the length
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date || date < tomorrow) {
      setError("Follow-ups can be booked from tomorrow onward.");
      return;
    }
    if (hour === "") {
      setError("Please choose a start time.");
      return;
    }

    try {
      setLoading(true);
      const result = await createFollowUp(appointment.id, {
        startAt: toLagosIso(date, Number(hour)),
        hours,
      });
      setCreated(result);
      onCreated?.(result);
    } catch (err) {
      setError(
        getServerError(err, "Could not create the follow-up. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <Modal open title="Follow-up scheduled" onClose={onClose}>
        <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>
            {created.client?.name} has been booked for {formatLagosDate(created.startAt)},{" "}
            {formatLagosTime(created.startAt)} – {formatLagosTime(created.endAt)}, and
            has been notified.
          </p>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          The Meet link isn't copied from the earlier session. Open the new
          appointment and add a link for it.
        </p>
        <div className="mt-5 flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open
      title="Schedule a follow-up"
      onClose={loading ? () => {} : onClose}
    >
      <p className="text-sm text-slate-600">
        <span className="font-semibold text-blue-950">{appointment.topic}</span>
        {" · "}
        {appointment.client?.name}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Earlier session: {formatLagosDate(appointment.startAt)},{" "}
        {formatLagosTime(appointment.startAt)} – {formatLagosTime(appointment.endAt)}
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
        <Info size={15} className="mt-0.5 shrink-0" />
        <p>
          The topic and description are copied over. Only one active follow-up
          is allowed per session, and the client will be notified.
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

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <Input
          id="follow-up-date"
          type="date"
          label="Date"
          min={tomorrow}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setError("");
          }}
        />

        <div>
          <label
            htmlFor="follow-up-hours"
            className="mb-1.5 block text-sm font-semibold text-blue-950"
          >
            Length
          </label>
          <select
            id="follow-up-hours"
            value={hours}
            onChange={handleHoursChange}
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-indigo-400"
          >
            {[1, 2, 3, 4].map((h) => (
              <option key={h} value={h}>
                {h} {h === 1 ? "hour" : "hours"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="follow-up-time"
            className="mb-1.5 block text-sm font-semibold text-blue-950"
          >
            Start time (Lagos time)
          </label>
          <select
            id="follow-up-time"
            value={hour}
            onChange={(e) => {
              setHour(e.target.value);
              setError("");
            }}
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-indigo-400"
          >
            <option value="">Select a time</option>
            {hourOptions.map((h) => (
              <option key={h} value={h}>
                {formatHour(h)} – {formatHour(h + hours)}
              </option>
            ))}
          </select>
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
                <Loader2 size={16} className="animate-spin" /> Scheduling...
              </>
            ) : (
              "Schedule follow-up"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}