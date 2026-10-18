import axios from "axios";
import { getAccessToken, getRefreshToken, saveTokens, clearSession } from "../utils/token";

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// 1. Attach the access token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 2. Refresh logic: only one refresh runs at a time
let refreshPromise = null;

const refreshTokens = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${baseURL}/auth/refresh`, { refreshToken: getRefreshToken() })
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data;
        saveTokens({ accessToken, refreshToken });
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const isCredentialRoute = (url = "") =>
  url.includes("/auth/signin") || url.includes("/auth/signup") || url.includes("/auth/refresh");

const forceLogout = () => {
  clearSession();
  if (window.location.pathname !== "/login") window.location.href = "/login";
};

// 3. When a request fails with 401, refresh the token once and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status !== 401 || !original || original._retry || isCredentialRoute(original.url)) {
      return Promise.reject(error);
    }

    if (!getRefreshToken()) {
      forceLogout();
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const newAccessToken = await refreshTokens();
      original.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(original);
    } catch (refreshError) {
      if (refreshError.response) forceLogout();
      return Promise.reject(refreshError);
    }
  }
);

export const getErrorMessage = (err, fallback = "Something went wrong") => {
  const data = err.response?.data;
  return (
    data?.message ||
    data?.error?.message ||
    (typeof data?.error === "string" ? data.error : "") ||
    fallback
  );
};

export default api;