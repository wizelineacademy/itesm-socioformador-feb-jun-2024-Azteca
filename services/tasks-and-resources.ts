"use server";
import { pipTask, pipResource } from "@/db/schema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function getUserTasks() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const res = await db
    .select()
    .from(pipTask)
    .where(eq(pipTask.userId, userId));
  return res;
}

export async function getUserResources() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const res = await db
    .select()
    .from(pipResource)
    .where(eq(pipResource.userId, userId));
  return res;
}