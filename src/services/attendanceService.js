import api from "./api";

export const attendanceService = {
  async exportMonthly(classId, month) {
    const response = await api.get("/attendance/export", {
      params: { classId, month },
      responseType: "blob",
    });
    return response.data;
  },

  async getForClassAndDate(classId, date) {
    const { data } = await api.get("/attendance", {
      params: { classId, date },
    });
    return data;
  },

  async save({ classId, date, records }) {
    const { data } = await api.post("/attendance", { classId, date, records });
    return data;
  },

  async update(id, { classId, date, records }) {
    const { data } = await api.put(`/attendance/${id}`, {
      classId,
      date,
      records,
    });
    return data;
  },

  async history(params = {}) {
    const { data } = await api.get("/attendance/history", { params });
    console.log(data)
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/attendance/${id}`);
    return data;
  },
};
