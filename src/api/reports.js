import api from "./axios";

export const getReport = async (appointmentId) => {
  const res = await api.get(`/appointments/${appointmentId}/report`);
  return res.data.data; // { appointmentId, status, report } (report is null when none exists)
};

export const saveReport = async (appointmentId, body) => {
  const res = await api.put(`/appointments/${appointmentId}/report`, body);
  return res.data.data; // { appointmentId, status, report }
};