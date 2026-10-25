const ACCESS = "accessToken";
const REFRESH = "refreshToken";
const USER = "user";

export const getAccessToken = () => sessionStorage.getItem(ACCESS);
export const getRefreshToken = () => sessionStorage.getItem(REFRESH);

export const saveTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) sessionStorage.setItem(ACCESS, accessToken);
  if (refreshToken) sessionStorage.setItem(REFRESH, refreshToken);
};

export const saveUser = (user) => sessionStorage.setItem(USER, JSON.stringify(user));

export const getStoredUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem(USER));
  } catch {
    return null;
  }
};

export const clearSession = () => {
  sessionStorage.removeItem(ACCESS);
  sessionStorage.removeItem(REFRESH);
  sessionStorage.removeItem(USER);
};

export const isLoggedIn = () => Boolean(getRefreshToken());