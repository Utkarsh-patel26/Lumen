import axios from "axios";
import { useAuthStore } from "../../store/authStore.js";
import { useUiStore } from "../../store/uiStore.js";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const client = axios.create({
  baseURL: apiBase,
  headers: {
    "Content-Type": "application/json"
  }
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      useAuthStore.getState().logout();
      useUiStore.getState().addToast({
        title: "Session expired",
        message: "Please log in again."
      });
    }
    return Promise.reject(error);
  }
);

export { client };
