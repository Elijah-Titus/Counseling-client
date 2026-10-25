import { useEffect, useState } from "react";
import { AlertCircle, CalendarCheck, CheckCircle2, Info, Loader2 } from "lucide-react";
import Input from "../../components/ui/input";
import Textarea from "../../components/ui/textarea";
import Button from "../../components/ui/button";
import { bookAppointment, getAvailability } from "../../api/appointments";
import { getErrorMessage } from "../../api/axios";
import {
  formatLagosDate,
  formatLagosTime,
  getLagosTomorrow,
  toLagosOffsetIso,
} from "../../utils/lagos-time";

const durations = [1, 2, 3, 4];
const emptyForm = { topic: "", description: "" };

function StepHeading({ number, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
        {number}
      </span>
      <h2 className="text-lg font-bold text-blue-950">{title}</h2>
    </div>
  );
}

export default function BookAppointment() {
  const tomorrow = getLagosTomorrow();

  const [date, setDate] = useState(tomorrow);
  const [hours, setHours] = useState(1);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState("");
  const [slotsKey, setSlotsKey] = useState(0);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(null);

  const dateValid = Boolean(date) && date >= tomorrow;

  // Load the free start times whenever the date or length changes
  useEffect(() => {
    if (!dateValid) {
      setSlots([]);
      setSlotsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setSlotsError("");
        setSlotsLoading(true);
        setSelected(null);
        const data = await getAvailability({ date, hours });
        if (!cancelled) setSlots(data.slots);
      } catch (err) {
        if (!cancelled) {
          setSlots([]);
          setSlotsError(getErrorMessage(err, "Could not load available times."));
        }
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [date, hours, dateValid, slotsKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const found = {};
    const topic = form.topic.trim();
    const description = form.description.trim();

    if (!selected) found.slot = "Please choose a time.";
    if (topic.length < 3 || topic.length > 150)
      found.topic = "The topic must be between 3 and 150 characters.";
    if (description.length < 10 || description.length > 2000)
      found.description = "Please describe what you'd like help with (10 to 2000 characters).";

    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    try {
      setSubmitting(true);

      const payload = {
        startAt: toLagosOffsetIso(selected.startAt),
        hours,
        topic: form.topic.trim(),
        description: form.description.trim(),
      };
      console.log("Booking request:", payload); // temporary, remove after testing

      const appointment = await bookAppointment(payload);
      setBooked(appointment);
    } catch (err) {
      const status = err.response?.status;
      console.log("Booking failed:", status, err.response?.data); // temporary, remove after testing

      setServerError(
        getErrorMessage(
          err,
          status === 409
            ? "That time is no longer available. Please choose another."
            : "Could not book your appointment. Please try again."
        )
      );
      if (status === 409) setSlotsKey((key) => key + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const bookAnother = () => {
    setBooked(null);
    setSelected(null);
    setForm(emptyForm);
    setErrors({});
    setSlotsKey((key) => key + 1);
  };

  if (booked) {
    const length = Math.round((new Date(booked.endAt) - new Date(booked.startAt)) / 3600000);

    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-white/70 p-8 text-center shadow-sm backdrop-blur sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="mt-5 text-2xl font-extrabold text-blue-950">Your session is booked</h2>
        <p className="mt-2 text-sm text-slate-600">
          You've been matched with{" "}
          <span className="font-semibold text-blue-950">{booked.counselor?.name}</span>.
        </p>

        <dl className="mt-6 space-y-3 rounded-2xl bg-indigo-50/70 p-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Date</dt>
            <dd className="text-right font-semibold text-blue-950">
              {formatLagosDate(booked.startAt)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Time</dt>
            <dd className="text-right font-semibold text-blue-950">
              {formatLagosTime(booked.startAt)} – {formatLagosTime(booked.endAt)} ({length}{" "}
              {length === 1 ? "hour" : "hours"})
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Topic</dt>
            <dd className="text-right font-semibold text-blue-950">{booked.topic}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-slate-500">All times are in Lagos time.</p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/dashboard/appointments">View my appointments</Button>
          <Button variant="outline" onClick={bookAnother}>
            Book another session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-3xl space-y-8 rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8"
    >
      <div className="flex items-start gap-2 rounded-xl bg-indigo-50 p-3 text-xs leading-relaxed text-indigo-800">
        <Info size={16} className="mt-0.5 shrink-0" />
        <p>
          Sessions run from 9:00 AM to 5:00 PM Lagos time, and all times here are in Lagos time.
          A counselor is matched to you automatically.
        </p>
      </div>

      {/* Step 1 */}
      <section className="space-y-4">
        <StepHeading number={1} title="Choose a date and length" />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="date"
            type="date"
            label="Date"
            min={tomorrow}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={!dateValid ? "Pick a date from tomorrow onward." : ""}
          />

          <div>
            <p className="mb-1.5 text-sm font-semibold text-blue-950">Session length</p>
            <div className="grid grid-cols-4 gap-2">
              {durations.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setHours(value)}
                  className={`rounded-xl border py-3 text-sm font-semibold transition ${
                    hours === value
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "border-slate-200 bg-white/80 text-blue-950 hover:border-indigo-300"
                  }`}
                >
                  {value} {value === 1 ? "hr" : "hrs"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Step 2 */}
      {dateValid && (
        <section className="space-y-4">
          <StepHeading number={2} title="Pick a time" />

          {slotsLoading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
              <Loader2 size={18} className="animate-spin" /> Checking available times...
            </div>
          ) : slotsError ? (
            <div className="flex flex-col items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <p className="flex items-center gap-2">
                <AlertCircle size={18} /> {slotsError}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setSlotsKey((key) => key + 1)}
              >
                Try again
              </Button>
            </div>
          ) : slots.length === 0 ? (
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              No times are available on this date for a {hours}-hour session. Try another date
              or a shorter session.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {slots.map((slot) => {
                const isSelected = selected?.startAt === slot.startAt;
                return (
                  <button
                    key={slot.startAt}
                    type="button"
                    onClick={() => {
                      setSelected(slot);
                      setErrors((prev) => ({ ...prev, slot: "" }));
                    }}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "border-slate-200 bg-white/80 text-blue-950 hover:border-indigo-300"
                    }`}
                  >
                    {formatLagosTime(slot.startAt)} – {formatLagosTime(slot.endAt)}
                  </button>
                );
              })}
            </div>
          )}

          {errors.slot && <p className="text-xs text-red-600">{errors.slot}</p>}
        </section>
      )}

      {/* Step 3 */}
      {selected && (
        <section className="space-y-4">
          <StepHeading number={3} title="Tell us what you'd like to talk about" />

          <Input
            id="topic"
            name="topic"
            type="text"
            label="Topic"
            placeholder="For example: Managing exam stress"
            maxLength={150}
            value={form.topic}
            onChange={handleChange}
            error={errors.topic}
          />

          <Textarea
            id="description"
            name="description"
            label="Description"
            rows={5}
            maxLength={2000}
            placeholder="Share a little about what's on your mind, so your counselor can prepare."
            value={form.description}
            onChange={handleChange}
            error={errors.description}
          />

          <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/70 p-4 text-sm">
            <CalendarCheck size={20} className="mt-0.5 shrink-0 text-indigo-600" />
            <p className="text-slate-700">
              <span className="font-semibold text-blue-950">
                {formatLagosDate(selected.startAt)}
              </span>
              <br />
              {formatLagosTime(selected.startAt)} – {formatLagosTime(selected.endAt)} ({hours}{" "}
              {hours === 1 ? "hour" : "hours"}, Lagos time)
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{serverError}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Booking...
              </>
            ) : (
              "Confirm booking"
            )}
          </Button>
        </section>
      )}
    </form>
  );
}