import api from "./api";

export const studentService = {
  async list(params = {}) {
    const { data } = await api.get("/students", { params });
    return data;
  },

  async get(id) {
    const { data } = await api.get(`/students/${id}`);
    return data;
  },

  async create(formData) {
    const { data } = await api.post("/students", formData, {
      headers: { "Content-Type": undefined },
    });
    return data;
  },

  async update(id, formData) {
    const { data } = await api.put(`/students/${id}`, formData, {
      headers: { "Content-Type": undefined },
    });
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/students/${id}`);
    return data;
  },
};