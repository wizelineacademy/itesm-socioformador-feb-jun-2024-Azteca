"use server";
import { pipTask, pipResource, userResource, sprintSurvey } from "@/db/schema";
import db from "@/db/drizzle";
import { eq, lte, and, desc } from "drizzle-orm";
import { auth } from "@/auth";

export async function getUserTasksForCurrentSprint(projectId: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const res = db
    .select()
    .from(sprintSurvey)
    .where(
      and(
        // sprint surveys that belong to that project
        eq(sprintSurvey.projectId, projectId),
        // sprint surveys of sprints that have been already scheduled (i.e. the surveys have already been launched)
        lte(sprintSurvey.scheduledAt, new Date()),
      ),
    )
    .orderBy(desc(sprintSurvey.scheduledAt))
    .limit(1);

  console.log(res);
  // check if the sprint is not processed to throw an error
  // check if there's no sprint survey results throw an error
}

export async function getUserTasksHistory() {}

export async function getUserResourcesForCurrentSprint() {
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

export async function getUserResourcesHistory() {}

export async function updateTask(taskId: number, isDone: boolean | null) {
  await db
    .update(pipTask)
    .set({ isDone: isDone })
    .where(eq(pipTask.id, taskId))
    .execute();
}
