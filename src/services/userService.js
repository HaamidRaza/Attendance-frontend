import api from "./api";

export const userService = {
  async list() {
    const { data } = await api.get("/users");
    return data;
  },

  async createTeacher(payload) {
    const { data } = await api.post("/users", payload);
    return data;
  },
};