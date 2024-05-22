import dotenv from "dotenv";
import { type Config } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL env var");
}

export default {
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
} satisfies Config;
