import { create } from "zustand";

const STORAGE_KEY = "cs_auth";

const readStorage = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  token: null,
  role: null,
  user: null,
  hydrated: false,
  login: ({ token, role, user }) => {
    const payload = { token, role, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    set({ token, role, user, hydrated: true });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, role: null, user: null, hydrated: true });
  },
  hydrate: () => {
    const data = readStorage();
    if (data?.token) {
      set({ token: data.token, role: data.role, user: data.user, hydrated: true });
    } else {
      set({ hydrated: true });
    }
  }
}));
