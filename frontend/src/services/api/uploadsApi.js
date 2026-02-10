import { client } from "./client.js";

const upload = async ({ file, type, folder, fileName }) => {
  const formData = new FormData();
  formData.append("file", file);
  if (type) formData.append("type", type);
  if (folder) formData.append("folder", folder);
  if (fileName) formData.append("fileName", fileName);

  const response = await client.post("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data.data;
};

export const uploadsApi = { upload };
