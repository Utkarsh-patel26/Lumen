import { client } from "./client.js";

const student = async () => {
  const response = await client.get("/dashboard/student");
  return response.data.data;
};

const admin = async () => {
  const response = await client.get("/dashboard/admin");
  return response.data.data;
};

export const dashboardApi = { student, admin };
