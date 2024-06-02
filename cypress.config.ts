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
    setupNodeEvents(on) {
      on("task", {
        async deleteDummyUser({ email }) {
          await db
            .delete(user)
            .where(eq(user.email, email))
            .then((res) => {
              if (res) {
                return true;
              }
            })
            .catch((err) => {
              console.error(err);
              return false;
            });
          return null;
        },
      });
    },
  },
});
