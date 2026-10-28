import api from "./axios";

export const getTestimonials = async () => {
  const res = await api.get("/testimonials");
  return res.data.data; // { items, total }, newest first, not paginated
};

export const getMyTestimonial = async () => {
  const res = await api.get("/testimonials/mine");
  return res.data.data; // { testimonial: {...} | null, canCreate }
};

export const createTestimonial = async ({ rating, content }) => {
  const res = await api.post("/testimonials", { rating, content });
  return res.data.data;
};

export const updateTestimonial = async (id, body) => {
  const res = await api.patch(`/testimonials/${id}`, body); // rating, content, or both
  return res.data.data;
};

export const deleteTestimonial = async (id) => {
  const res = await api.delete(`/testimonials/${id}`);
  return res.data.data; // { id }
};