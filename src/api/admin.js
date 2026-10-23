import api from "./axios";

export const getCounselors = async () => {
  const res = await api.get("/admin/counselors");
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