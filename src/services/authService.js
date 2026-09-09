import api from "./api";

// This is a minimal auth implementation for the MVP. It is structured so a
// real backend can plug in JWT issuance/verification without changes to the
// rest of the app: `login` stores the token, `api.js` attaches it to every
// request, and a 401 response anywhere logs the user out automatically.
export const authService = {
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    if (data?.token) {
      localStorage.setItem("auth_token", data.token);
    }
    if (data?.user) {
      localStorage.setItem("auth_user", JSON.stringify(data.user));
    }
    return data;
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },

  getToken() {
    return localStorage.getItem("auth_token");
  },

  getUser() {
    const raw = localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem("auth_token"));
  },
};
