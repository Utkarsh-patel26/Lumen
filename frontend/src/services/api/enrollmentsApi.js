import { client } from "./client.js";

const enroll = async (courseId) => {
  const response = await client.post(`/enroll/${courseId}`);
  return response.data.data;
};

const listMine = async () => {
  const response = await client.get("/my-courses");
  return response.data.data;
};

const listAdmin = async () => {
  const response = await client.get("/enrollments/admin");
  return response.data.data;
};

const markLessonComplete = async (courseId, lessonId) => {
  const response = await client.post(`/enroll/${courseId}/lessons/${lessonId}/complete`);
  return response.data.data;
};

export const enrollmentsApi = { enroll, listMine, listAdmin, markLessonComplete };
