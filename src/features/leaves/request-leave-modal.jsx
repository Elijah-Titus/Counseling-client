import { useState } from "react";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import Modal from "../../components/ui/modal";
import Input from "../../components/ui/input";
import Textarea from "../../components/ui/textarea";
import Button from "../../components/ui/button";
import { requestLeave } from "../../api/leaves";
import { getErrorMessage } from "../../api/axios";
import {
  formatLagosDateShort,
  formatLagosTime,
  getLagosToday,
  toLagosIso,
} from "../../utils/lagos-time";

const startHours = [9, 10, 11, 12, 13, 14, 15, 16];
const endHours = [10, 11, 12, 13, 14, 15, 16, 17];

const hourLabel = (hour) => `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? "PM" : "AM"}`;

// Shows the backend's field messages when there are some, otherwise its main message
const readServerError = (err) => {
  const fields = err.response?.data?.errors;
  const messages =
    fields && typeof fields === "object" && !Array.isArray(fields)
      ? Object.values(fields)
          .flat()
          .filter((message) => typeof message === "string")
      : [];

  if (messages.length > 0) return messages.join(" ");
  return getErrorMessage(err, "Could not send your leave request. Please try again.");
};

function HourSelect({ id, label, value, options, onChange, disabled }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-blue-950">
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-blue-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      >
        {options.map((hour) => (
          <option key={hour} value={hour}>
            {hourLabel(hour)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function RequestLeaveModal({ onClose, onRequested }) {
  const today = getLagosToday();

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);
  const [fullDay, setFullDay] = useState(true);
  const [reason, setReason] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Whole working days always run from 9:00 AM to 5:00 PM
  const sh = fullDay ? 9 : startHour;
  const eh = fullDay ? 17 : endHour;

  const handleStartDate = (value) => {
    setStartDate(value);
    if (!endDate || endDate < value) setEndDate(value);
    setErrors((prev) => ({ ...prev, start: "" }));
  };

  const validate = () => {
    const found = {};

    if (!startDate) found.start = "Choose a start date.";
    if (!endDate) found.end = "Choose an end date.";

    if (startDate && endDate) {
      const start = new Date(toLagosIso(startDate, sh)).getTime();
      const end = new Date(toLagosIso(endDate, eh)).getTime();

      if (start <= Date.now()) found.start = "The leave must start in the future.";
      else if (end <= start) found.end = "The leave must end after it starts.";
    }

    const text = reason.trim();
    if (text.length < 3 || text.length > 500)
      found.reason = "Please give a reason (3 to 500 characters).";

    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    try {
      setLoading(true);
      const leave = await requestLeave({
        startAt: toLagosIso(startDate, sh),
        endAt: toLagosIso(endDate, eh),
        reason: reason.trim(),
      });
      onRequested(leave);
    } catch (err) {
      setServerError(readServerError(err));
    } finally {
      setLoading(false);
    }
  };

  const summaryReady = startDate && endDate;

  return (
    <Modal open title="Request leave" onClose={loading ? () => {} : onClose}>
      <div className="flex items-start gap-2 rounded-xl bg-indigo-50 p-3 text-xs leading-relaxed text-indigo-800">
        <Info size={15} className="mt-0.5 shrink-0" />
        <p>
          Your request stays pending until an administrator approves it, and blocks nothing
          until then. All times are in Lagos time.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-blue-950">
          <input
            type="checkbox"
            checked={fullDay}
            onChange={(e) => setFullDay(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
          />
          Whole working days (9:00 AM to 5:00 PM)
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <Input
              id="leave-start"
              type="date"
              label="Starts on"
              min={today}
              value={startDate}
              onChange={(e) => handleStartDate(e.target.value)}
              error={errors.start}
            />
            <HourSelect
              id="leave-start-hour"
              label="Start time"
              value={sh}
              options={startHours}
              disabled={fullDay}
              onChange={setStartHour}
            />
          </div>

          <div className="space-y-3">
            <Input
              id="leave-end"
              type="date"
              label="Ends on"
              min={startDate || today}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setErrors((prev) => ({ ...prev, end: "" }));
              }}
              error={errors.end}
            />
            <HourSelect
              id="leave-end-hour"
              label="End time"
              value={eh}
              options={endHours}
              disabled={fullDay}
              onChange={setEndHour}
            />
          </div>
        </div>

        {summaryReady && (
          <p className="rounded-xl bg-indigo-50/70 p-3 text-xs leading-relaxed text-slate-700">
            <span className="font-semibold text-blue-950">
              {formatLagosDateShort(toLagosIso(startDate, sh))}, {formatLagosTime(toLagosIso(startDate, sh))}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-blue-950">
              {formatLagosDateShort(toLagosIso(endDate, eh))}, {formatLagosTime(toLagosIso(endDate, eh))}
            </span>
          </p>
        )}

        <Textarea
          id="leave-reason"
          label="Reason"
          rows={3}
          maxLength={500}
          placeholder="For example: Medical appointment"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setErrors((prev) => ({ ...prev, reason: "" }));
          }}
          error={errors.reason}
        />

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
                <Loader2 size={16} className="animate-spin" /> Sending...
              </>
            ) : (
              "Request leave"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}