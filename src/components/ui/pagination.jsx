import { ChevronLeft, ChevronRight } from "lucide-react";

const getPages = (page, totalPages) => {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...wanted].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push("gap");
    result.push(p);
  });
  return result;
};

const arrowClass =
  "flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40";

export default function Pagination({ page, totalPages, total, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-indigo-100 pt-4 sm:flex-row">
      <p className="text-xs text-slate-500">
        Showing {from}–{to} of {total}
      </p>

      <nav className="flex flex-wrap items-center gap-1" aria-label="Pagination">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={arrowClass}
        >
          <ChevronLeft size={16} />
        </button>

        {getPages(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <span key={`gap-${index}`} className="px-1 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={`h-9 min-w-[2.25rem] rounded-lg px-3 text-sm font-semibold transition ${
                item === page
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-slate-600 hover:bg-indigo-50"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className={arrowClass}
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}