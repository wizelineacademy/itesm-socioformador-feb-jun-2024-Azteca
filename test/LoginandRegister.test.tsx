import { describe, it, expect, vi } from "vitest";
import { loginAction, registerAction } from "../actions";
import { signIn } from "next-auth/react";
import { registerUser } from "@/services/user";
import { AuthError } from "next-auth";
import { DatabaseError } from "pg";

// Mock the external functions
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("@/services/user", () => ({
  registerUser: vi.fn(),
}));

describe("Auth Actions", () => {
  describe("loginAction", () => {
    it("calls signIn with correct data", async () => {
      const formData = new FormData();
      formData.append("username", "testuser");
      formData.append("password", "testpassword");

      (signIn as any).mockResolvedValueOnce(null);

      await loginAction(formData);

      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "testuser",
        password: "testpassword",
      });
    });

    it("returns error message for invalid credentials", async () => {
      const formData = new FormData();
      formData.append("username", "testuser");
      formData.append("password", "testpassword");

      (signIn as any).mockRejectedValueOnce(new AuthError("CredentialsSignin"));

      const result = await loginAction(formData);

      expect(result).toBe("Invalid credentials.");
    });

    it("throws unknown errors", async () => {
      const formData = new FormData();
      formData.append("username", "testuser");
      formData.append("password", "testpassword");

      (signIn as any).mockRejectedValueOnce(new Error("Unknown error"));

      await expect(loginAction(formData)).rejects.toThrow("Unknown error");
    });
  });

  describe("registerAction", () => {
    it("registers a user and signs in", async () => {
      const formData = new FormData();
      formData.append("name", "Test User");
      formData.append("jobTitle", "Developer");
      formData.append("department", "IT");
      formData.append("email", "testuser@example.com");
      formData.append("password", "testpassword");

      (registerUser as any).mockResolvedValueOnce(null);
      (signIn as any).mockResolvedValueOnce(null);

      await registerAction(formData);

      expect(registerUser).toHaveBeenCalledWith({
        name: "Test User",
        jobTitle: "Developer",
        department: "IT",
        email: "testuser@example.com",
        password: "testpassword",
      });
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "testuser@example.com",
        password: "testpassword",
      });
    });

    it("handles unique constraint violation", async () => {
      const formData = new FormData();
      formData.append("name", "Test User");
      formData.append("jobTitle", "Developer");
      formData.append("department", "IT");
      formData.append("email", "testuser@example.com");
      formData.append("password", "testpassword");

      (registerUser as any).mockRejectedValueOnce(
        new DatabaseError("Email already registered 23505")
      );

      const result = await registerAction(formData);

      expect(result).toBe("UniqueConstraintViolation");
    });

    it("handles general registration errors", async () => {
      const formData = new FormData();
      formData.append("name", "Test User");
      formData.append("jobTitle", "Developer");
      formData.append("department", "IT");
      formData.append("email", "testuser@example.com");
      formData.append("password", "testpassword");

      (registerUser as any).mockRejectedValueOnce(new DatabaseError("Error registering the user"));

      const result = await registerAction(formData);

      expect(result).toBe("ConnectionError");
    });

    it("returns error message for invalid credentials after registration", async () => {
      const formData = new FormData();
      formData.append("name", "Test User");
      formData.append("jobTitle", "Developer");
      formData.append("department", "IT");
      formData.append("email", "testuser@example.com");
      formData.append("password", "testpassword");

      (registerUser as any).mockResolvedValueOnce(null);
      (signIn as any).mockRejectedValueOnce(new AuthError("CredentialsSignin"));

      const result = await registerAction(formData);

      expect(result).toBe("Invalid credentials.");
    });

    it("throws unknown errors during sign in after registration", async () => {
      const formData = new FormData();
      formData.append("name", "Test User");
      formData.append("jobTitle", "Developer");
      formData.append("department", "IT");
      formData.append("email", "testuser@example.com");
      formData.append("password", "testpassword");

      (registerUser as any).mockResolvedValueOnce(null);
      (signIn as any).mockRejectedValueOnce(new Error("Unknown error"));

      await expect(registerAction(formData)).rejects.toThrow("Unknown error");
    });
  });
});
