import { useState } from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";
import Modal from "../../components/ui/modal";
import Button from "../../components/ui/button";

export default function PasswordRevealModal({ data, onDone }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the password can still be selected on screen
    }
  };

  const handleDone = () => {
    setCopied(false);
    onDone();
  };

  return (
    <Modal open={!!data} title={data?.title} dismissible={false} onClose={handleDone}>
      {data && (
        <>
          <p className="text-sm text-slate-600">
            Temporary password for <span className="font-semibold text-blue-950">{data.name}</span>{" "}
            ({data.email}).
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-indigo-50 px-4 py-3">
            <code className="select-all break-all font-mono text-lg font-bold text-indigo-700">
              {data.password}
            </code>
            <button
              onClick={handleCopy}
              aria-label="Copy password"
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            <p>
              Copy it now and share it securely. This password can't be shown again. If it's
              lost, reset the password to get a new one.
            </p>
          </div>

          <Button onClick={handleDone} className="mt-6 w-full">
            I've saved the password
          </Button>
        </>
      )}
    </Modal>
  );
}