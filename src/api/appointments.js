import api from "./axios";

export const getAvailability = async ({ date, hours = 1 }) => {
  const res = await api.get("/appointments/availability", { params: { date, hours } });
  return res.data.data; // { date, hours, slots: [{ startAt, endAt }] }
};

export const bookAppointment = async ({ startAt, hours, topic, description }) => {
  const res = await api.post("/appointments", { startAt, hours, topic, description });
  return res.data.data; // the new appointment, with the assigned counselor
};

export const getAppointments = async ({ scope = "upcoming", page = 1, limit = 10 } = {}) => {
  const res = await api.get("/appointments", { params: { scope, page, limit } });
  return res.data.data; // { items, total, page, limit }
};

export const cancelAppointment = async (id) => {
  const res = await api.patch(`/appointments/${id}/cancel`);
  return res.data.data; // the appointment, now CANCELLED
};

export const rescheduleAppointment = async (id, startAt) => {
  const res = await api.patch(`/appointments/${id}/reschedule`, { startAt });
  return res.data.data; // the appointment with its new time
};

export const getAppointment = async (id) => {
  const res = await api.get(`/appointments/${id}`);
  return res.data.data; // one appointment (counselors also get notes)
};