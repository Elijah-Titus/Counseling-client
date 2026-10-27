import { useState } from "react";
import { Check, Copy, Video } from "lucide-react";
import { validateMeetLink } from "../../utils/meet-link";

export default function JoinSession({ appointment }) {
  const [copied, setCopied] = useState(false);

  if (appointment.status !== "AWAITING") return null;

  const link = appointment.meetLink;

  // Show the waiting message when there is no link, or it fails the safety check
  if (!link || validateMeetLink(link)) {
    return (
      <p className="text-sm text-slate-500">Your counselor will add the link soon.</p>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Fallback for browsers that block the clipboard API
      const box = document.createElement("textarea");
      box.value = link;
      document.body.appendChild(box);
      box.select();
      document.execCommand("copy");
      document.body.removeChild(box);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white/80 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-blue-950">
        <Video size={16} className="text-indigo-600" />
        Google Meet link
      </p>

      <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-4 pr-1.5">
        <span className="min-w-0 flex-1 select-all truncate text-sm text-slate-700">
          {link}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
      >
        <Video size={16} /> Join session
      </a>
    </div>
  );
}