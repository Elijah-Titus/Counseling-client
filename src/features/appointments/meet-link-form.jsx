import { useEffect, useState } from "react";
import { Video, Pencil, CheckCircle2 } from "lucide-react";
import { setMeetLink } from "../../api/appointments";
import { getErrorMessage } from "../../api/axios";
import { validateMeetLink } from "../../utils/meet-link";

export default function MeetLinkForm({ appointment, onSaved, getConflict }) {
  const [link, setLink] = useState(appointment.meetLink || "");
  const [acknowledged, setAcknowledged] = useState(Boolean(appointment.acknowledged));
  const [editing, setEditing] = useState(!appointment.meetLink);
  const [value, setValue] = useState(appointment.meetLink || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Keep in sync if the parent reloads (e.g. after a reschedule or reassignment)
  useEffect(() => {
    setLink(appointment.meetLink || "");
    setAcknowledged(Boolean(appointment.acknowledged));
    setValue(appointment.meetLink || "");
    if (!appointment.meetLink) setEditing(true);
  }, [appointment.meetLink, appointment.acknowledged]);

  if (appointment.status !== "AWAITING") return null;

  const handleSave = async () => {
    const trimmed = value.trim();
    const problem = validateMeetLink(trimmed);
    if (problem) {
      setError(problem);
      return;
    }
    if (trimmed === link) {
      setEditing(false);
      return;
    }
    const conflict = getConflict?.(trimmed);
    if (conflict) {
      setError(conflict);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await setMeetLink(appointment.id, trimmed);
      setLink(updated.meetLink || "");
      setAcknowledged(Boolean(updated.acknowledged));
      setEditing(false);
      onSaved?.(updated);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't save the Meet link."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white/80 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-blue-950">
          <Video size={16} className="text-indigo-600" />
          Google Meet link
        </p>
        {acknowledged && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 size={12} /> Acknowledged
          </span>
        )}
      </div>

      {editing ? (
        <div className="mt-3 space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            placeholder="https://meet.google.com/abc-defg-hij"
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save link"}
            </button>
            {link && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setValue(link);
                  setError("");
                }}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm text-indigo-600 hover:underline"
          >
            {link}
          </a>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>
      )}
    </div>
  );
}