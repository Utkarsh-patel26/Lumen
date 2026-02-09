import { create } from "zustand";
import { coursesApi } from "../services/api/coursesApi.js";
import { useUiStore } from "./uiStore.js";

export const useCourseStore = create((set) => ({
  courses: [],
  course: null,
  loading: false,
  total: 0,
  page: 1,
  limit: 10,
  search: "",
  fetchCourses: async ({ page = 1, limit = 10, search = "" } = {}) => {
    set({ loading: true });
    try {
      const data = await coursesApi.list({ page, limit, search });
      set({ courses: data.items, total: data.total, page, limit, search });
    } catch (err) {
      useUiStore.getState().addToast({ title: "Failed to load courses" });
    } finally {
      set({ loading: false });
    }
  },
  fetchCourse: async (id) => {
    set({ loading: true });
    try {
      const data = await coursesApi.getById(id);
      set({ course: data });
    } catch (err) {
      useUiStore.getState().addToast({ title: "Course not found" });
    } finally {
      set({ loading: false });
    }
  },
  fetchMyCourses: async () => {
    set({ loading: true });
    try {
      const data = await coursesApi.listByCreator();
      set({ courses: data });
    } catch (err) {
      useUiStore.getState().addToast({ title: "Failed to load your courses" });
    } finally {
      set({ loading: false });
    }
  },
  createCourse: async (payload) => {
    try {
      const data = await coursesApi.create(payload);
      useUiStore.getState().addToast({ title: "Course created" });
      return data;
    } catch (err) {
      useUiStore.getState().addToast({ title: "Course creation failed" });
      throw err;
    }
  },
  updateCourse: async (id, payload) => {
    try {
      const data = await coursesApi.update(id, payload);
      useUiStore.getState().addToast({ title: "Course updated" });
      return data;
    } catch (err) {
      useUiStore.getState().addToast({ title: "Course update failed" });
      throw err;
    }
  },
  deleteCourse: async (id) => {
    try {
      await coursesApi.remove(id);
      useUiStore.getState().addToast({ title: "Course deleted" });
    } catch (err) {
      useUiStore.getState().addToast({ title: "Course delete failed" });
      throw err;
    }
  }
}));
