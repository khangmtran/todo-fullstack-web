import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

api.interceptors.request.use((retApi) => {
  const token = localStorage.getItem("token");
  if (token) retApi.headers.Authorization = `Bearer ${token}`;
  return retApi;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      // Don't redirect if user already on auth pages
      if (!currentPath.includes("/login") && !currentPath.includes("/signup")) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
