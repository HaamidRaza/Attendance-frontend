import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the auth token to every request, ready for JWT-based auth.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data &&
      "success" in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    if (
      error.response?.data instanceof Blob &&
      error.response.data.type === "application/json"
    ) {
      try {
        const text = await error.response.data.text();
        error.response.data = JSON.parse(text);
      } catch {
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(normalizeError(error));
  },
);

export function normalizeError(error) {
  // If there's no HTTP response, prefer the axios error message when available
  if (!error.response) {
    const msg =
      error?.message && error.message !== "Network Error"
        ? error.message
        : "Can't reach the server. Check your connection and try again.";
    return { message: msg, status: null };
  }

  const { status, data } = error.response;

  // Try to extract a useful message from known response shapes
  const extractedMessage =
    data?.message ||
    data?.error?.message ||
    data?.error ||
    (typeof data === "string" ? data : undefined) ||
    error?.message;

  if (status === 409) {
    return {
      message: extractedMessage || "This record already exists.",
      status,
    };
  }

  if (status === 400 || status === 422) {
    return {
      message: extractedMessage || "Please check the form and try again.",
      status,
      fieldErrors: data?.errors || data?.error?.errors,
    };
  }

  if (status === 404) {
    return { message: extractedMessage || "Not found.", status };
  }

  if (status >= 500) {
    return {
      message: "Something went wrong on our end. Please try again.",
      status,
    };
  }

  return {
    message: extractedMessage || "Something went wrong. Please try again.",
    status,
  };
}

export default api;
