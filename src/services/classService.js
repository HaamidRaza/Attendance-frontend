import api from "./api";

export const classService = {
  async list() {
    const { data } = await api.get("/classes");
    return data;
  },

  async get(id) {
    const { data } = await api.get(`/classes/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post("/classes", payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/classes/${id}`, payload);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/classes/${id}`);
    return data;
  },

  async students(id) {
    const { data } = await api.get("/students", { params: { classId: id } });
    return data;
  },
};
