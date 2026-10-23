import { useCallback, useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { clearSession, isLoggedIn } from "../utils/token";

export default function useVerifiedUser() {
  const [state, setState] = useState(() => ({
    status: isLoggedIn() ? "checking" : "signed-out",
    user: null,
  }));
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) {
      setState({ status: "signed-out", user: null });
      return;
    }

    let cancelled = false;

    getMe()
      .then((user) => {
        if (!cancelled) setState({ status: "verified", user });
      })
      .catch((err) => {
        if (cancelled) return;

        const code = err.response?.status;
        if (code === 401 || code === 403) {
          clearSession();
          setState({ status: "signed-out", user: null });
        } else {
          setState({ status: "error", user: null });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "checking", user: null });
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}