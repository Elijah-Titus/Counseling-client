import api from "./axios";
import { saveTokens, saveUser, clearSession, getRefreshToken } from "../utils/token";

const startSession = ({ user, accessToken, refreshToken }) => {
  saveTokens({ accessToken, refreshToken });
  saveUser(user);
  return user;
};

export const login = async (credentials, { blockedRoles = [] } = {}) => {
  const res = await api.post("/auth/signin", credentials);
  const { user, refreshToken } = res.data.data;

  if (blockedRoles.includes(user.role)) {
    // End the session the server just created, without ever saving it here
    await api.post("/auth/signout", { refreshToken }).catch(() => {});

    const error = new Error("This role cannot sign in here");
    error.code = "ROLE_BLOCKED";
    throw error;
  }

  return startSession(res.data.data);
};

export const register = async (details) => {
  const res = await api.post("/auth/signup", details);
  return startSession(res.data.data);
};

export const logout = async () => {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) await api.post("/auth/signout", { refreshToken });
  } catch {
    // Even if the server can't be reached, we still sign out on this device
  } finally {
    clearSession();
  }
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  saveUser(res.data.data);
  return res.data.data;
};

export const changePassword = async ({ oldPassword, newPassword }) => {
  const res = await api.post("/auth/change-password", { oldPassword, newPassword });
  saveTokens(res.data.data);
  return res.data.data;
};