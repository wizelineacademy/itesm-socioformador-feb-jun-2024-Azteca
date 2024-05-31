import db from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST() {
  try {
    // Delete cypress user
    await db.delete(user).where(eq(user.email, "cypress@gmail.com"));
    console.log("User deleted successfully");
    // Return success response
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    // Return error response
    return NextResponse.json({ message: "Error deleting user" });
  }
}
