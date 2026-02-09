import { client } from "./client.js";

const list = async ({ page = 1, limit = 10, search = "" }) => {
  const response = await client.get("/courses", {
    params: { page, limit, search }
  });
  if (response.data?.data) {
    return response.data.data;
  }
  if (response.data?.courses) {
    const total = response.data.total ?? response.data.courses.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    return { items: response.data.courses, total, page, limit, pages };
  }
  return { items: [], total: 0, page, limit, pages: 1 };
};

const getById = async (id) => {
  const response = await client.get(`/courses/${id}`);
  return response.data.data;
};

const listByCreator = async () => {
  const response = await client.get("/admin/courses");
  return response.data.data;
};

const create = async (payload) => {
  const response = await client.post("/admin/courses", payload);
  return response.data.data;
};

const update = async (id, payload) => {
  const response = await client.put(`/admin/courses/${id}`, payload);
  return response.data.data;
};

const remove = async (id) => {
  const response = await client.delete(`/admin/courses/${id}`);
  return response.data.data;
};

export const coursesApi = { list, getById, listByCreator, create, update, remove };
