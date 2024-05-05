import type { Config } from "drizzle-kit";
 
export default {
  schema: "./db/schema.ts",
  out: "./drizzleMigrations",
  driver: "pg", 
} satisfies Config;