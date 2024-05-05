import dotenv from "dotenv";
import { type Config } from "drizzle-kit";

dotenv.config({
  path: ".env",
});

export default {
  schema: "./db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
  },
} satisfies Config;
