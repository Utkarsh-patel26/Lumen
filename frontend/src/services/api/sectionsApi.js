import { client } from "./client.js";

const create = async (courseId, payload) => {
  const response = await client.post(`/courses/${courseId}/sections`, payload);
  return response.data.data;
};

const update = async (sectionId, payload) => {
  const response = await client.put(`/sections/${sectionId}`, payload);
  return response.data.data;
};

const remove = async (sectionId) => {
  const response = await client.delete(`/sections/${sectionId}`);
  return response.data.data;
};

export const sectionsApi = { create, update, remove };
