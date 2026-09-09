import api from "./api";

export const attendanceService = {
  // Fetch an existing attendance record for a class/date so the Take
  // Attendance page can pre-fill it and switch into "update" mode.
  async getForClassAndDate(classId, date) {
    const { data } = await api.get("/attendance", { params: { classId, date } });
    return data;
  },

  async save({ classId, date, records }) {
    const { data } = await api.post("/attendance", { classId, date, records });
    return data;
  },

  async update(id, { classId, date, records }) {
    const { data } = await api.put(`/attendance/${id}`, { classId, date, records });
    return data;
  },

  async history(params = {}) {
    const { data } = await api.get("/attendance/history", { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/attendance/${id}`);
    return data;
  },
};
