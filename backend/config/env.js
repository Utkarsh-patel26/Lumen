import dotenv from "dotenv";

dotenv.config();

const env = {
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET || "dev_jwt_secret",
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
};

export { env };
