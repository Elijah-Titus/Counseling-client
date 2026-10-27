import api from "./axios";

export const getMessages = async (appointmentId) => {
  const res = await api.get(`/appointments/${appointmentId}/messages`);
  return res.data.data; // { items, total, readOnly }
};

export const sendMessage = async (appointmentId, message) => {
  const res = await api.post(`/appointments/${appointmentId}/messages`, { message });
  return res.data.data; // the new message
};

// No body. Marks the other person's unread messages as read.
export const markMessagesRead = async (appointmentId) => {
  const res = await api.patch(`/appointments/${appointmentId}/messages/read`);
  return res.data.data; // { marked }
};

export const deleteMessage = async (appointmentId, messageId) => {
  const res = await api.delete(`/appointments/${appointmentId}/messages/${messageId}`);
  return res.data.data; // { id, deleted: true }
};