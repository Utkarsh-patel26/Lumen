const env = {
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET || "dev_jwt_secret",
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  nodeEnv: process.env.NODE_ENV || "development"
};

export { env };
