"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import {
  finalSurvey,
  finalSurveyAnswer,
  project,
  projectMember,
  rulerSurveyAnswers,
  sprintSurvey,
  sprintSurveyAnswerProject,
} from "@/db/schema";
import { eq, and, sql, gte, isNull } from "drizzle-orm";
import { Notification } from "@/types/types";

export async function getNotifications() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const notifications = [];

  // const currentTimestamp = new Date(
  //   new Date().toLocaleString("es-MX", { timeZone: "America/Monterrey" }),
  // );

  // const currentDateString = currentTimestamp.toISOString().split("T")[0];
  // const currentDateTimeString = currentTimestamp
  //   .toISOString()
  //   .replace("T", " ")
  //   .split(".")[0];

  // Get the notifications of the sprint surveys
  const sprintSurveys = await db
    .select({
      id: sprintSurvey.id,
      projectName: project.name,
      date: sprintSurvey.scheduledAt,
    })
    .from(sprintSurvey)
    .innerJoin(project, eq(project.id, sprintSurvey.projectId))
    .innerJoin(projectMember, eq(projectMember.projectId, project.id))
    .leftJoin(
      sprintSurveyAnswerProject,
      and(
        eq(sprintSurvey.id, sprintSurveyAnswerProject.sprintSurveyId),
        eq(sprintSurveyAnswerProject.userId, projectMember.userId),
      ),
    )
    .where(
      and(
        eq(projectMember.userId, userId), // the surveys belong to a user's project
        isNull(sprintSurveyAnswerProject.sprintSurveyId),
        eq(sprintSurvey.processed, false), // the surveys aren't processed
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
  // Get the notifications of the final surveys
  const finalSurveys = await db
    .select({
      id: finalSurvey.id,
      projectName: project.name,
      date: finalSurvey.scheduledAt,
    })
    .from(finalSurvey)
    .innerJoin(project, eq(project.id, finalSurvey.projectId))
    .innerJoin(projectMember, eq(projectMember.projectId, project.id))
    .leftJoin(
      finalSurveyAnswer,
      and(
        eq(finalSurvey.id, finalSurveyAnswer.finalSurveyId),
        eq(finalSurveyAnswer.userId, projectMember.userId),
      ),
    )
    .where(
      and(
        eq(projectMember.userId, userId), // the surveys belong to a user's project
        isNull(finalSurveyAnswer.finalSurveyId),
        eq(finalSurvey.processed, false), // the surveys aren't processed
        gte(sql`CURRENT_TIMESTAMP`, finalSurvey.scheduledAt), // the survey itself is active (i.e. has been scheduled)
      ),
    );

  console.log("FINAL SURVEY: ", finalSurveys);
  if (finalSurveys.length > 0) {
    for (const finalSurvey of finalSurveys) {
      notifications.push({
        ...finalSurvey,
        type: "FINAL",
      });
    }
  }

  // Get the notifications of the ruler surveys
  const rulerSurveys = await db
    .select()
    .from(rulerSurveyAnswers)
    .where(
      and(
        eq(rulerSurveyAnswers.userId, userId), // the survey belongs to the user
        eq(rulerSurveyAnswers.answeredAt, sql`CURRENT_TIMESTAMP::date`), // is today's survey
      ),
    );

  console.log("RULER :", rulerSurveys);

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
