"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { registerUser } from "./services/user";
import { DatabaseErrorType } from "./types/errorTypes";
import { DatabaseError } from "pg";

export const loginAction = async (formData: FormData) => {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
};

export const registerAction = async (formData: FormData) => {
  try {
    const name = formData.get("name")?.toString();
    const jobTitle = formData.get("jobTitle")?.toString();
    const department = formData.get("department")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    await registerUser(name, email, password, department, jobTitle);
  } catch (e) {
    const dbError = e as DatabaseError;

    let errorType: DatabaseErrorType;
    if (dbError.message === "Email already registered")
      errorType = "UniqueConstraintViolation";
    else if (dbError.message === "Error registering the user")
      errorType = "ConnectionError";
    else errorType = "GeneralError";

    return errorType;
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
};
