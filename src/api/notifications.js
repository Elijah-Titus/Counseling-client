import api from "./axios";

// unreadOnly = true  -> only unread ones (?unread=true)
// unreadOnly = false -> everything (the docs: unread=false returns all)
export const getNotifications = async ({ unreadOnly = false } = {}) => {
  const params = unreadOnly ? { unread: true } : {};
  const res = await api.get("/notifications", { params });
  return res.data.data; // { items, total, unreadCount }
};

export const markNotificationRead = async (id) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data.data; // { id, read: true }
};

export const markAllNotificationsRead = async () => {
  const res = await api.patch("/notifications/read-all");
  return res.data.data; // { marked }
};