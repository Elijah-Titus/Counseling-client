import api from "./axios";

export const getCounselors = async ({ search = "", page = 1, limit = 20 } = {}) => {
  const params = { page, limit };
  if (search) params.search = search;

  const res = await api.get("/admin/counselors", { params });
  return res.data.data; // { items, total }
};

export const createCounselor = async ({ name, email, password }) => {
  const body = { name, email };
  if (password) body.password = password;
  const res = await api.post("/admin/counselors", body);
  return res.data.data; // { counselor, password }
};

export const setUserStatus = async (id, isActive) => {
  const res = await api.patch(`/admin/users/${id}/status`, { isActive });
  return res.data.data; // { id, name, email, role, isActive }
};

export const resetCounselorPassword = async (id) => {
  const res = await api.post(`/admin/counselors/${id}/reset-password`, {});
  return res.data.data; // { password }
};

const viewFilters = {
  upcoming: { status: "AWAITING", abandoned: false },
  missed: { abandoned: true },
  completed: { status: "COMPLETED" },
  cancelled: { status: "CANCELLED" },
};

export const getAllAppointments = async ({
  view = "",
  counselorId,
  clientId,
  from,
  to,
  page = 1,
  limit = 10,
} = {}) => {
  const params = { page, limit, ...(viewFilters[view] || {}) };
  if (counselorId) params.counselorId = counselorId;
  if (clientId) params.clientId = clientId;
  if (from) params.from = from;
  if (to) params.to = to;

  const res = await api.get("/admin/appointments", { params });
  return res.data.data; // { items, total, page, limit }
};

export const getAppointmentCounts = async () => {
  const count = async (view) => (await getAllAppointments({ view, page: 1, limit: 1 })).total;

  const [upcoming, missed, completed, cancelled] = await Promise.all([
    count("upcoming"),
    count("missed"),
    count("completed"),
    count("cancelled"),
  ]);

  return { upcoming, missed, completed, cancelled };
};

export const getCounselor = async (id) => {
  const res = await api.get(`/admin/counselors/${id}`);
  return res.data.data; // { id, name, email, isActive, dateOfBirth, yearsOfExperience, gender, avatar, createdAt }
};

export const getAdminLeaves = async ({ status = "", counselorId, page = 1, limit = 10 } = {}) => {
  const params = { page, limit };
  if (status) params.status = status;
  if (counselorId) params.counselorId = counselorId;

  const res = await api.get("/admin/leaves", { params });
  return res.data.data; // { items, total, page, limit }
};

export const getAdminLeave = async (id) => {
  const res = await api.get(`/admin/leaves/${id}`);
  return res.data.data; // the leave, plus appointments[] when it is pending
};

export const decideLeave = async (id, { status, note }) => {
  const body = { status };
  if (status === "DECLINED" && note) body.note = note;

  const res = await api.patch(`/admin/leaves/${id}/decision`, body);
  return res.data.data; // the leave, plus reassigned when approved
};