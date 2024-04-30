"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { project, sprintSurvey } from "@/db/schema";
import { eq, and, lte, sql } from "drizzle-orm";

export async function getNotifications() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  // Get the notifications of the sprint surveys

  // get all of the surveys of the active projects where
  // the surveys aren't processed yet and they are published

  const res = await db
    .select()
    .from(sprintSurvey)
    .innerJoin(project, eq(sprintSurvey.projectId, project.id))
    .where(
      and(
        eq(sprintSurvey.processed, false),
        lte(sql`CURRENT_TIMESTAMP`, project.endDate),
      ),
    );

  console.log(res);
  // TODO: Get the notifications of the project surveys
  // TODO: Get the notifications of the ruler surveys
}
