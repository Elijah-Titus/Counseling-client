import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAppointments } from "../api/appointments";

const POLL_MS = 30000;

// Adds up unreadMessages across the person's appointments.
// (The docs have no "total unread" endpoint, so we sum what the list returns.)
export default function useUnreadMessages() {
  const { pathname } = useLocation();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await getAppointments({ scope: "all", page: 1, limit: 100 });
        if (!cancelled) {
          setCount(data.items.reduce((sum, a) => sum + (a.unreadMessages || 0), 0));
        }
      } catch {
        // A missing badge isn't worth an error.
      }
    };

    load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [pathname]); // refresh after every page change, so the badge drops once you've read

  return count;
}