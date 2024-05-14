import dotenv from "dotenv";
import { type Config } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

export default {
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
} satisfies Config;
