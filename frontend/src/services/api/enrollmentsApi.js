import { client } from "./client.js";

const enroll = async (courseId) => {
  const response = await client.post("/enrollments", { courseId });
  return response.data.data;
};

const listMine = async () => {
  const response = await client.get("/enrollments/me");
  return response.data.data;
};

const listAdmin = async () => {
  const response = await client.get("/enrollments/admin");
  return response.data.data;
};

export const enrollmentsApi = { enroll, listMine, listAdmin };
