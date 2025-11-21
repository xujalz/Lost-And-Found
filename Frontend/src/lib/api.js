import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // match your backend (you used /api)
  withCredentials: true,
});

// Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token.trim()}`;
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
