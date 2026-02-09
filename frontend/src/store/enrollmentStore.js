import { create } from "zustand";
import { enrollmentsApi } from "../services/api/enrollmentsApi.js";
import { useUiStore } from "./uiStore.js";

export const useEnrollmentStore = create((set) => ({
  enrollments: [],
  loading: false,
  enroll: async (courseId) => {
    try {
      const enrollment = await enrollmentsApi.enroll(courseId);
      useUiStore.getState().addToast({ title: "Enrolled successfully" });
      return enrollment;
    } catch (err) {
      useUiStore.getState().addToast({ title: "Enrollment failed" });
      throw err;
    }
  },
  fetchMyEnrollments: async () => {
    set({ loading: true });
    try {
      const data = await enrollmentsApi.listMine();
      set({ enrollments: data });
    } catch (err) {
      useUiStore.getState().addToast({ title: "Failed to load enrollments" });
    } finally {
      set({ loading: false });
    }
  },
  fetchAdminEnrollments: async () => {
    set({ loading: true });
    try {
      const data = await enrollmentsApi.listAdmin();
      set({ enrollments: data });
    } catch (err) {
      useUiStore.getState().addToast({ title: "Failed to load admin enrollments" });
    } finally {
      set({ loading: false });
    }
  }
}));
