import type { Config } from "drizzle-kit";
 
export default {
  schema: "./db/schema.ts",
  out: "./drizzlemigrations",
  driver: "pg", 
} satisfies Config;