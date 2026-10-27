import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../api/notifications";
import { getStoredUser } from "../../utils/token";
import { getMeta, inboxPath, notificationLink, timeAgo } from "./notification-meta";

const POLL_MS = 30000; // notifications are delivered by polling

export default function NotificationBell() {
  const navigate = useNavigate();
  const role = getStoredUser()?.role;
  const boxRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    try {
      const data = await getNotifications();
      setItems(data.items);
      setUnreadCount(data.unreadCount);
    } catch {
      // A failed poll isn't worth an error; the next one will try again.
    }
  }, []);

  // Poll while the tab is visible, and refresh as soon as the person returns to it.
  useEffect(() => {
    load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const handleOpenItem = async (n) => {
    setOpen(false);

    if (!n.read) {
      // Optimistic: update the screen first, then tell the server.
      setItems((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      setUnreadCount((c) => Math.max(0, c - 1));
      markNotificationRead(n.id).catch(load);
    }

    const to = notificationLink(n, role);
    if (to) navigate(to);
  };

  const handleReadAll = async () => {
    setItems((list) => list.map((x) => ({ ...x, read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      load();
    }
  };

  const latest = items.slice(0, 6);

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-blue-950 transition hover:bg-white"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-[18px] text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-[72px] z-30 overflow-hidden rounded-2xl bg-white shadow-xl shadow-indigo-200/60 ring-1 ring-indigo-100 sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-extrabold text-blue-950">Notifications</h2>
            {unreadCount > 0 && (
              <button
                onClick={handleReadAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          {latest.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-slate-500">
              You're all caught up.
            </p>
          ) : (
            <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
              {latest.map((n) => {
                const meta = getMeta(n.type);
                const Icon = meta.icon;
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => handleOpenItem(n)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-indigo-50/60 ${
                        n.read ? "" : "bg-indigo-50/40"
                      }`}
                    >
                      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.tone}`}>
                        <Icon size={15} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {meta.label}
                        </span>
                        <span className={`mt-0.5 block text-sm leading-snug ${n.read ? "text-slate-600" : "font-semibold text-blue-950"}`}>
                          {n.message}
                        </span>
                        <span className="mt-1 block text-xs text-slate-400">{timeAgo(n.createdAt)}</span>
                      </span>
                      {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            to={inboxPath(role)}
            onClick={() => setOpen(false)}
            className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-50/60"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}