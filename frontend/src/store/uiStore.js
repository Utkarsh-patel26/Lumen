import { create } from "zustand";

export const useUiStore = create((set, get) => ({
  toasts: [],
  addToast: ({ title, message }) => {
    const id = `${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, title, message }]
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 3800);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  }
}));
