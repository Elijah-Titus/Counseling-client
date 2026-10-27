import { Link } from "react-router-dom";
import { UserCheck, UserX } from "lucide-react";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function ClientsTable({ clients, onToggleStatus }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-indigo-100 text-xs uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3 font-semibold">Client</th>
            <th className="px-4 py-3 font-semibold">Phone</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Joined</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((c) => (
            <tr key={c.id} className="border-b border-indigo-50 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {c.avatar ? (
                    <img src={c.avatar} alt={c.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                      {c.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <Link
                      to={`/admin/clients/${c.id}`}
                      className="block truncate font-semibold text-blue-950 transition hover:text-indigo-600 hover:underline"
                    >
                      {c.name}
                    </Link>
                    <p className="truncate text-xs text-slate-500">{c.email}</p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3 text-slate-600">{c.phone || <span className="text-slate-400">Not provided</span>}</td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    c.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {c.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="px-4 py-3 text-slate-600">{formatDate(c.createdAt)}</td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onToggleStatus(c)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      c.isActive
                        ? "text-red-600 hover:bg-red-50"
                        : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {c.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                    {c.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}