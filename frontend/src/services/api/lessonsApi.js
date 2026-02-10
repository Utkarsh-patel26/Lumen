import { client } from "./client.js";

const create = async (sectionId, payload) => {
  const response = await client.post(`/sections/${sectionId}/lessons`, payload);
  return response.data.data;
};

const update = async (lessonId, payload) => {
  const response = await client.put(`/lessons/${lessonId}`, payload);
  return response.data.data;
};

const remove = async (lessonId) => {
  const response = await client.delete(`/lessons/${lessonId}`);
  return response.data.data;
};

export const lessonsApi = { create, update, remove };
