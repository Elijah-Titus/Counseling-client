import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, MoonStar, SunMedium } from "lucide-react";
import NotificationBell from "../../features/notifications/notification-bell";

const THEME_KEY = "counseling-theme";

export default function PortalHeader({ title, user, onMenuClick }) {
  const initial = user?.name?.[0]?.toUpperCase() || "?";
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem(THEME_KEY) || "light";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";

    root.classList.toggle("dark", isDark);
    window.localStorage.setItem(THEME_KEY, theme);

    return () => {
      root.classList.remove("dark");
    };
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeOptions = [
    { value: "light", label: "Light", Icon: SunMedium },
    { value: "dark", label: "Dark", Icon: MoonStar },
  ];

  const isDark = theme === "dark";

  return (
    <header
      className={`sticky top-0 z-20 border-b backdrop-blur-md transition-colors ${
        isDark ? "border-slate-700 bg-slate-900/80" : "border-white/40 bg-white/40"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className={isDark ? "text-slate-100 lg:hidden" : "text-blue-950 lg:hidden"}
          >
            <Menu size={26} />
          </button>
          <h1 className={`text-xl font-extrabold ${isDark ? "text-white" : "text-blue-950"}`}>
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell dark={isDark} />

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className={`flex items-center gap-2 rounded-full border px-2 py-1.5 transition ${
                isDark
                  ? "border-slate-700 bg-slate-800/80 text-slate-100 hover:bg-slate-700"
                  : "border-slate-200 bg-white/80 text-blue-950 hover:bg-slate-50"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                {initial}
              </div>
              <span className="hidden text-sm font-semibold sm:block">{user?.name}</span>
              <ChevronDown size={16} className={menuOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>

            {menuOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border shadow-lg ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-100"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <div className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Theme
                </div>

                {themeOptions.map(({ value, label, Icon }) => {
                  const selected = theme === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setTheme(value);
                        setMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-sm transition ${
                        selected ? (isDark ? "bg-slate-700 text-white" : "bg-indigo-50 text-indigo-700") : isDark ? "hover:bg-slate-700" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={16} />
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}