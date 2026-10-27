import { Link, NavLink } from "react-router-dom";
import { KeyRound, LogOut, X } from "lucide-react";
import Logo from "../ui/logo";

export default function PortalSidebar({ items, user, roleLabel, open, onClose, onLogout }) {
  const initial = user?.name?.[0]?.toUpperCase() || "?";

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-blue-950/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/60 bg-white/80 p-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between">
          <Logo />
          <button onClick={onClose} aria-label="Close menu" className="text-blue-950 lg:hidden">
            <X size={22} />
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {items.map(({ label, to, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-blue-950 hover:bg-indigo-50"
                }`
              }
            >
              <Icon size={18} />
              {label}
              {badge > 0 && (
                <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 rounded-2xl bg-indigo-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-blue-950">{user?.name}</p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
          </div>

          <Link
            to="/change-password"
            onClick={onClose}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-indigo-700 transition hover:bg-white"
          >
            <KeyRound size={16} /> Change password
          </Link>
          <button
            onClick={onLogout}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}