import { Menu } from "lucide-react";

export default function PortalHeader({ title, user, onMenuClick }) {
  const initial = user?.name?.[0]?.toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-20 border-b border-white/40 bg-white/40 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="text-blue-950 lg:hidden"
          >
            <Menu size={26} />
          </button>
          <h1 className="text-xl font-extrabold text-blue-950">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
            {initial}
          </div>
          <span className="hidden text-sm font-semibold text-blue-950 sm:block">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
}