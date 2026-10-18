const ACCESS = "accessToken";
const REFRESH = "refreshToken";
const USER = "user";

export const getAccessToken = () => localStorage.getItem(ACCESS);
export const getRefreshToken = () => localStorage.getItem(REFRESH);

export const saveTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem(ACCESS, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH, refreshToken);
};

export const saveUser = (user) => localStorage.setItem(USER, JSON.stringify(user));

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER));
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  localStorage.removeItem(USER);
};

export const isLoggedIn = () => Boolean(getRefreshToken());