export default function Input({ label, id, icon: Icon, error, right, className = "", ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-blue-950">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          id={id}
          aria-invalid={!!error}
          className={`w-full rounded-xl border bg-white/80 py-3 text-sm text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
            Icon ? "pl-11" : "pl-4"
          } ${right ? "pr-12" : "pr-4"} ${error ? "border-red-400" : "border-slate-200"}`}
          {...props}
        />

        {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}