"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import {
  finalSurvey,
  project,
  rulerSurveyAnswers,
  sprintSurvey,
} from "@/db/schema";
import { eq, and, lte, sql, gte } from "drizzle-orm";
import { Notification } from "@/types";

export async function getNotifications() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  let notifications = [];

  // Get the notifications of the sprint surveys
  const sprintSurveys = await db
    .select({
      id: sprintSurvey.id,
      projectName: project.name,
      date: sprintSurvey.scheduledAt,
    })
    .from(sprintSurvey)
    .innerJoin(project, eq(sprintSurvey.projectId, project.id))
    .where(
      and(
        eq(sprintSurvey.processed, false), // the surveys aren't processed
        lte(sql`CURRENT_TIMESTAMP`, project.endDate), // the project is active (i.e. hasn't expired)
        gte(sql`CURRENT_TIMESTAMP`, sprintSurvey.scheduledAt), // the survey itself is active (i.e. has been scheduled)
      ),
    );

  if (sprintSurveys.length > 0) {
    for (const sprintSurvey of sprintSurveys) {
      notifications.push({
        ...sprintSurvey,
        type: "SPRINT",
      });
    }
  }

  // TODO: Get the notifications of the final surveys
  const finalSurveys = await db
    .select({
      id: finalSurvey.id,
      projectName: project.name,
      date: finalSurvey.scheduledAt,
    })
    .from(finalSurvey)
    .innerJoin(project, eq(finalSurvey.projectId, project.id))
    .where(
      and(
        eq(finalSurvey.processed, false), // the surveys aren't processed
        lte(sql`CURRENT_TIMESTAMP`, project.endDate), // the project is active (i.e. hasn't expired)
        gte(sql`CURRENT_TIMESTAMP`, finalSurvey.scheduledAt), // the survey itself is active (i.e. has been scheduled)
      ),
    );

  if (finalSurveys.length > 0) {
    for (const finalSurvey of finalSurveys) {
      notifications.push({
        ...finalSurvey,
        type: "FINAL",
      });
    }
  }

  // TODO: Get the notifications of the ruler surveys
  const rulerSurveys = await db
    .select()
    .from(rulerSurveyAnswers)
    .where(
      and(
        eq(rulerSurveyAnswers.userId, userId), // the survey belongs to the user
        eq(rulerSurveyAnswers.answeredAt, sql`CURRENT_TIMESTAMP::date`), // is today's survey
      ),
    );

  if (rulerSurveys.length === 0) {
    // if there are no answers, send notification
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    notifications.push({
      id: null,
      projectName: null,
      date: today,
      type: "RULER",
    });
  }

  return notifications as Notification[];
}
