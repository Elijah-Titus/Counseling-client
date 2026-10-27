import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  dismissible = true,
  scrollable = false,
  className = "",
  children,
}) {
  useEffect(() => {
    if (!open || !dismissible) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={dismissible ? onClose : undefined}
        className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full rounded-3xl bg-white p-6 shadow-2xl sm:p-8 ${
          scrollable ? "flex max-h-[calc(100dvh-2rem)] flex-col" : "max-w-md"
        } ${className}`}
      >
        {dismissible && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 text-slate-400 transition hover:text-blue-950"
          >
            <X size={20} />
          </button>
        )}
        <h2 className="shrink-0 pr-8 text-xl font-extrabold text-blue-950">{title}</h2>
        <div className={`mt-4 ${scrollable ? "min-h-0 overflow-y-auto" : ""}`}>{children}</div>
      </div>
    </div>
  );
}