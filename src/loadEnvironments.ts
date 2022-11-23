import dotenv from "dotenv";

dotenv.config();

const environment = {
  port: process.env.PORT ?? 4000,
  debug: process.env.DEBUG,
  mongoDbUrl: process.env.MONGODB_URL,
  mongoDbDebug: process.env.MONGODB_DEBUG === "true",
  jwtSecret: process.env.JWT_SECRET,
};

export default environment;
