import dotenv from "dotenv";

dotenv.config();

const environment = {
  port: process.env.PORT ?? 4000,
  debug: process.env.DEBUG,
};

export default environment;
