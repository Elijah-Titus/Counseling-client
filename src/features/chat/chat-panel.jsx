import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Lock, MessageCircle, Send, Trash2 } from "lucide-react";
import { deleteMessage, getMessages, markMessagesRead, sendMessage } from "../../api/chat";
import { getStoredUser } from "../../utils/token";
import { getServerError } from "../../utils/server-error";
import { formatLagosDate, formatLagosTime } from "../../utils/lagos-time";

const POLL_MS = 10000; // chat is delivered by polling
const MAX_LENGTH = 2000;

export default function ChatPanel({ appointmentId, otherName = "them", refreshKey = 0 }) {
  const me = getStoredUser()?.id;

  const [messages, setMessages] = useState([]);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noAccess, setNoAccess] = useState(false);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const listRef = useRef(null);
  const stickToBottom = useRef(true);
  const markedRef = useRef(new Set()); // ids we've already asked the server to mark read

  const load = useCallback(async () => {
    try {
      const data = await getMessages(appointmentId);
      setMessages(data.items);
      setReadOnly(data.readOnly);
      setNoAccess(false);

      // Listing never marks anything read, so do it ourselves while the tab is visible.
      if (document.visibilityState === "visible") {
        const unread = data.items.filter(
          (m) => m.senderId !== me && !m.readAt && !markedRef.current.has(m.id)
        );
        if (unread.length > 0) {
          unread.forEach((m) => markedRef.current.add(m.id));
          markMessagesRead(appointmentId).catch(() => {});
        }
      }
    } catch (err) {
      if (err.response?.status === 404) setNoAccess(true);
      // Other failures during polling are ignored; the next poll will try again.
    } finally {
      setLoading(false);
    }
  }, [appointmentId, me]);

  // First load, a reload requested by the page, and then polling.
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
  }, [load, refreshKey]);

  // Keep the newest message in view, unless the person has scrolled up to read.
  useEffect(() => {
    const el = listRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
  };

  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && trimmed.length <= MAX_LENGTH && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setError("");
    try {
      const sent = await sendMessage(appointmentId, trimmed);
      setMessages((list) => [...list, sent]);
      setText("");
      stickToBottom.current = true;
    } catch (err) {
      setError(getServerError(err, "Your message was not sent."));
      if (err.response?.status === 409) load(); // the chat has just closed
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(appointmentId, id);
      setMessages((list) =>
        list.map((m) => (m.id === id ? { ...m, deleted: true, message: null } : m))
      );
    } catch (err) {
      setError(getServerError(err, "That message could not be deleted."));
      load();
    } finally {
      setConfirmId(null);
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends, Shift+Enter adds a new line.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
        <MessageCircle size={15} /> Chat with {otherName}
      </h3>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Loading messages...
        </div>
      ) : noAccess ? (
        <p className="mt-4 rounded-xl bg-slate-100 p-4 text-center text-sm text-slate-500">
          You no longer have access to this chat.
        </p>
      ) : (
        <>
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="mt-4 max-h-96 min-h-[8rem] space-y-2 overflow-y-auto rounded-2xl bg-indigo-50/50 p-3"
          >
            {messages.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">
                No messages yet.{readOnly ? "" : " Say hello, or ask about a different time."}
              </p>
            )}

            {messages.map((m, i) => {
              const mine = m.senderId === me;
              const day = formatLagosDate(m.createdAt);
              const showDay = i === 0 || formatLagosDate(messages[i - 1].createdAt) !== day;

              return (
                <div key={m.id}>
                  {showDay && (
                    <p className="my-2 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {day}
                    </p>
                  )}

                  <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                      <div
                        className={`rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                          m.deleted
                            ? "border border-dashed border-slate-300 italic text-slate-400"
                            : mine
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-blue-950 shadow-sm"
                        }`}
                      >
                        {m.deleted ? (
                          "This message was deleted"
                        ) : (
                          <span className="whitespace-pre-wrap break-words">{m.message}</span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{formatLagosTime(m.createdAt)}</span>
                        {mine && !m.deleted && <span>{m.readAt ? "Seen" : "Sent"}</span>}

                        {mine && !m.deleted && !readOnly && (
                          confirmId === m.id ? (
                            <span className="flex items-center gap-2">
                              <button
                                onClick={() => handleDelete(m.id)}
                                className="font-semibold text-rose-600 hover:underline"
                              >
                                Delete?
                              </button>
                              <button
                                onClick={() => setConfirmId(null)}
                                className="hover:underline"
                              >
                                Keep
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setConfirmId(m.id)}
                              aria-label="Delete message"
                              className="hover:text-rose-600"
                            >
                              <Trash2 size={12} />
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}

          {readOnly ? (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-100 p-3 text-xs leading-relaxed text-slate-500">
              <Lock size={14} className="mt-0.5 shrink-0" />
              This chat is closed. You can still read the messages, but no new ones can be sent.
            </div>
          ) : (
            <div className="mt-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  placeholder="Write a message..."
                  className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-blue-950 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
              <p className={`mt-1 text-right text-[11px] ${text.length > MAX_LENGTH ? "text-rose-600" : "text-slate-400"}`}>
                {text.length}/{MAX_LENGTH}
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}