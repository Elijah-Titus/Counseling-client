import api from "./axios";
import { normalizePage } from "./paging";

export const requestLeave = async ({ startAt, endAt, reason }) => {
  const res = await api.post("/leaves", { startAt, endAt, reason });
  return res.data.data; // the leave, plus affectedAppointments
};



export const getMyLeaves = async ({ status = "", page = 1, limit = 10 } = {}) => {
  const params = { page, limit };
  if (status) params.status = status;

  const res = await api.get("/leaves", { params });
  return normalizePage(res.data.data, page, limit); // { items, total }
};

export const cancelLeave = async (id) => {
  const res = await api.patch(`/leaves/${id}/cancel`);
  return res.data.data; // the leave, now CANCELLED
};