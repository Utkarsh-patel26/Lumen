import { cloudinary } from "../config/cloudinary.js";

const uploadBuffer = async ({ buffer, folder, resourceType, fileName }) => {
  const encoded = buffer.toString("base64");
  const dataUri = `data:application/octet-stream;base64,${encoded}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: resourceType,
    public_id: fileName,
    overwrite: true
  });
  return result.secure_url;
};

export { uploadBuffer };
