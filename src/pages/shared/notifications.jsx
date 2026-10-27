import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCheck, Loader2 } from "lucide-react";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../api/notifications";
import { getStoredUser } from "../../utils/token";
import { getServerError } from "../../utils/server-error";
import { getMeta, notificationLink, timeAgo } from "../../features/notifications/notification-meta";

const tabs = [
  { label: "All", unreadOnly: false },
  { label: "Unread", unreadOnly: true },
];

export default function Notifications() {
  const navigate = useNavigate();
  const role = getStoredUser()?.role;

  const [tab, setTab] = useState(0);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const data = await getNotifications({ unreadOnly: tabs[tab].unreadOnly });
      setItems(data.items);
      setUnreadCount(data.unreadCount); // always the full unread total, whatever the tab
    } catch (err) {
      setError(getServerError(err, "We couldn't load your notifications."));
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const handleOpen = async (n) => {
    if (!n.read) {
      setItems((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      setUnreadCount((c) => Math.max(0, c - 1));
      markNotificationRead(n.id).catch(load);
    }
    const to = notificationLink(n, role);
    if (to) navigate(to);
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      load();
    } catch (err) {
      setError(getServerError(err, "We couldn't mark them as read."));
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTab(i)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                tab === i ? "bg-indigo-600 text-white" : "bg-white/70 text-blue-950 hover:bg-white"
              }`}
            >
              {t.label}
              {t.unreadOnly && unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleReadAll}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16 text-indigo-600">
          <Loader2 className="animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl bg-white/80 py-16 text-center text-sm text-slate-500">
          {tabs[tab].unreadOnly ? "Nothing unread. You're all caught up." : "No notifications yet."}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => {
            const meta = getMeta(n.type);
            const Icon = meta.icon;
            return (
              <li key={n.id}>
                <button
                  onClick={() => handleOpen(n)}
                  className={`flex w-full items-start gap-4 rounded-2xl p-4 text-left transition hover:bg-white ${
                    n.read ? "bg-white/60" : "bg-white shadow-sm shadow-indigo-100"
                  }`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.tone}`}>
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {meta.label}
                      </span>
                      <span className="text-xs text-slate-400">· {timeAgo(n.createdAt)}</span>
                    </span>
                    <span className={`mt-0.5 block text-sm leading-relaxed ${n.read ? "text-slate-600" : "font-semibold text-blue-950"}`}>
                      {n.message}
                    </span>
                  </span>
                  {!n.read && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}