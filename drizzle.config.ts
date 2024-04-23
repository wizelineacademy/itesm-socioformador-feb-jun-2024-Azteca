//import type { Config } from "drizzle-kit";

//export default {
//schema: "./db/schema.ts",
//out: "./drizzlemigrations",
//driver: "pg",
//} satisfies Config;
import dotenv from "dotenv";
import { type Config } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

export default {
  schema: "./db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
  },
} satisfies Config;
