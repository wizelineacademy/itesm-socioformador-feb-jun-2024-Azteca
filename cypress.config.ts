import db from "./db/drizzle";
import { user } from "./db/schema";
import { defineConfig } from "cypress";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export default defineConfig({
  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    POSTGRES_URL: process.env.POSTGRES_URL,
  },
  e2e: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      on("task", {
        async deleteDummyUser({ email }) {
          try {
            const res = await db.delete(user).where(eq(user.email, email));

            return res ? true : false;
          } catch (err) {
            console.error(err);
            return false;
          }
        },
      });

      return config;
    },
  },
});
