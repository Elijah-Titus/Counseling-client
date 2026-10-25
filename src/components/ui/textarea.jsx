export default function Textarea({
  label,
  id,
  error,
  maxLength,
  value,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-end justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-blue-950">
          {label}
        </label>
        {maxLength && (
          <span className="text-xs text-slate-400">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        id={id}
        value={value}
        maxLength={maxLength}
        aria-invalid={!!error}
        className={`w-full resize-y rounded-xl border bg-white/80 px-4 py-3 text-sm text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
          error ? "border-red-400" : "border-slate-200"
        }`}
        {...props}
      />

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}