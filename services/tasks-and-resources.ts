"use server";
import { pipTask, pipResource, userResource } from "@/db/schema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function getUserTasks() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const res = await db.select().from(pipTask).where(eq(pipTask.userId, userId));
  return res;
}

export async function getUserResources() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const res = await db
    .select({
      id: pipResource.id,
      userId: userResource.userId,
      title: pipResource.title,
      description: pipResource.description,
      kind: pipResource.kind,
    })
    .from(userResource)
    .innerJoin(pipResource, eq(userResource.resourceId, pipResource.id))
    .where(eq(userResource.userId, userId));

  return res;
}

export async function updateTask(taskId: number, isDone: boolean | null) {
  await db
    .update(pipTask)
    .set({ isDone: isDone })
    .where(eq(pipTask.id, taskId))
    .execute();
}
