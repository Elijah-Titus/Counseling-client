import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Clock, Loader2, MessageCircle } from "lucide-react";
import ChatPanel from "../../features/chat/chat-panel";
import { getAppointments } from "../../api/appointments";
import { getStoredUser } from "../../utils/token";
import { getServerError } from "../../utils/server-error";
import { ROLES } from "../../utils/roles";
import { formatLagosDate, formatLagosTime } from "../../utils/lagos-time";

const POLL_MS = 15000;
const CHAT_WINDOW_MS = 72 * 3600 * 1000; // chats close 72h after the session ends

// A chat is "active" while the session is still booked and the chat hasn't closed.
const isActiveChat = (a) =>
  a.status === "AWAITING" && Date.now() < new Date(a.endAt).getTime() + CHAT_WINDOW_MS;

export default function Messages() {
  const isCounselor = getStoredUser()?.role === ROLES.COUNSELOR;
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("appointment");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showClosed, setShowClosed] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getAppointments({ scope: "all", page: 1, limit: 100 });
      setItems(data.items);
      setError("");
    } catch (err) {
      setError(getServerError(err, "We couldn't load your conversations."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  const nameOf = (a) => (isCounselor ? a.client?.name : a.counselor?.name) || "Unknown";

  // Active chats: ones with new messages first, then the soonest session.
  const active = items
    .filter(isActiveChat)
    .sort(
      (a, b) =>
        (b.unreadMessages > 0) - (a.unreadMessages > 0) ||
        new Date(a.startAt) - new Date(b.startAt)
    );
  const closed = items
    .filter((a) => !isActiveChat(a))
    .sort((a, b) => new Date(b.startAt) - new Date(a.startAt));

  const selected = items.find((a) => a.id === selectedId);
  const select = (id) => setSearchParams({ appointment: id });
  const clear = () => setSearchParams({});

  const renderRow = (a, isClosed) => {
    const isSelected = a.id === selectedId;
    const unread = isSelected ? 0 : a.unreadMessages || 0;

    return (
      <li key={a.id}>
        <button
          onClick={() => select(a.id)}
          className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${
            isSelected ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-white/80 hover:bg-white"
          }`}
        >
          <span
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
              isSelected ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700"
            }`}
          >
            {nameOf(a)[0]?.toUpperCase()}
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className={`truncate text-sm font-bold ${isSelected ? "text-white" : "text-blue-950"}`}>
                {nameOf(a)}
              </span>
              {unread > 0 && (
                <span className="shrink-0 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white">
                  {unread}
                </span>
              )}
            </span>
            <span className={`block truncate text-xs ${isSelected ? "text-indigo-100" : "text-slate-500"}`}>
              {a.topic}
            </span>
            <span
              className={`mt-1 flex items-center gap-1 text-[11px] ${isSelected ? "text-indigo-100" : "text-slate-400"}`}
            >
              <Clock size={11} />
              {formatLagosDate(a.startAt)} · {formatLagosTime(a.startAt)}
              {isClosed && " · Closed"}
            </span>
          </span>
        </button>
      </li>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500">
        <Loader2 size={18} className="animate-spin" /> Loading conversations...
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[320px_1fr]">
      {/* Conversation list. On phones it hides once a chat is open. */}
      <aside className={`space-y-3 ${selectedId ? "hidden lg:block" : ""}`}>
        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Active sessions
        </h2>

        {active.length === 0 ? (
          <p className="rounded-2xl bg-white/70 p-6 text-center text-sm text-slate-500">
            No active conversations. When a session is booked, you can chat with{" "}
            {isCounselor ? "the client" : "your counselor"} here.
          </p>
        ) : (
          <ul className="space-y-2">{active.map((a) => renderRow(a, false))}</ul>
        )}

        {closed.length > 0 && (
          <>
            <button
              onClick={() => setShowClosed((v) => !v)}
              className="px-1 text-xs font-semibold text-indigo-600 hover:underline"
            >
              {showClosed ? "Hide closed chats" : `Show closed chats (${closed.length})`}
            </button>
            {showClosed && <ul className="space-y-2">{closed.map((a) => renderRow(a, true))}</ul>}
          </>
        )}
      </aside>

      {/* The chat itself. On phones it only shows once a conversation is picked. */}
      <div className={selectedId ? "" : "hidden lg:block"}>
        {selectedId ? (
          <div className="space-y-3">
            <button
              onClick={clear}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline lg:hidden"
            >
              <ArrowLeft size={16} /> All conversations
            </button>

            {selected && (
              <div className="rounded-2xl bg-white/70 px-5 py-3">
                <p className="font-bold text-blue-950">{selected.topic}</p>
                <p className="text-xs text-slate-500">
                  {formatLagosDate(selected.startAt)} · {formatLagosTime(selected.startAt)} –{" "}
                  {formatLagosTime(selected.endAt)} · Lagos time
                </p>
              </div>
            )}

            {/* key makes the chat start fresh whenever another conversation is chosen */}
            <ChatPanel
              key={selectedId}
              appointmentId={selectedId}
              otherName={selected ? nameOf(selected) : "them"}
            />
          </div>
        ) : (
          <div className="flex h-full min-h-[20rem] flex-col items-center justify-center gap-2 rounded-3xl bg-white/60 p-10 text-center text-slate-500">
            <MessageCircle size={32} className="text-indigo-300" />
            <p className="text-sm font-semibold text-blue-950">Select a conversation</p>
            <p className="text-sm">Pick a session on the left to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}