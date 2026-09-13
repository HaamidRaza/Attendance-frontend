import api from "./api";

export const userService = {
  async list() {
    const { data } = await api.get("/users");
    return data;
  },

  async get(id) {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  async createTeacher(payload) {
    const { data } = await api.post("/users", payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },
};
