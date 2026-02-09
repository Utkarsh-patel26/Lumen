import { client } from "./client.js";

const signup = async (payload) => {
  const response = await client.post("/auth/signup", payload);
  return response.data.data;
};

const login = async (payload) => {
  const response = await client.post("/auth/login", payload);
  return response.data.data;
};

export const authApi = { signup, login };
