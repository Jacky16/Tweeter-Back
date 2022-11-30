import dotenv from "dotenv";

dotenv.config();

const environment = {
  port: process.env.PORT ?? 4000,
  debug: process.env.DEBUG,
  mongoDbUrl: process.env.MONGODB_URL,
  mongoDbDebug: process.env.MONGODB_DEBUG === "true",
  jwtSecret: process.env.JWT_SECRET,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  supabaseBucket: process.env.SUPABASE_BUCKET,
};

export default environment;
