"use server";

import db from "@/db/drizzle";
import { user } from "@/db/schema";
import bcrypt from "bcrypt";

export const registerUser = async (
  name: string | undefined,
  email: string | undefined,
  password: string | undefined,
) => {
  try {
    if (!name || !email || !password) {
      throw new Error("Empty email or empty password");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .insert(user)
      .values({
        name: name,
        email: email,
        password: hashedPassword,
        role: "EMPLOYEE",
      });
  } catch (error) {
    console.error("Could not register user", error);
    throw new Error("Could not register user");
  }
};
