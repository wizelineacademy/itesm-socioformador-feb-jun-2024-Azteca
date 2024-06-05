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
import { eq, and, sql, gte } from "drizzle-orm";
import { Notification } from "@/types/types";

export async function getNotifications() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const notifications = [];

  const currentTimestamp = new Date(
    new Date().toLocaleString("es-MX", { timeZone: "America/Monterrey" }),
  );

  const currentDateString = currentTimestamp.toISOString().split("T")[0];
  const currentDateTimeString = currentTimestamp
    .toISOString()
    .replace("T", " ")
    .split(".")[0];

  // Get the notifications of the sprint surveys
  const sprintSurveys = await db
    .select({
      id: sprintSurvey.id,
      projectName: project.name,
      date: sprintSurvey.scheduledAt,
      answerUserId: sprintSurveyAnswerProject.userId,
    })
    .from(sprintSurvey)
    .innerJoin(project, eq(project.id, sprintSurvey.projectId))
    .innerJoin(projectMember, eq(projectMember.projectId, project.id))
    .leftJoin(
      sprintSurveyAnswerProject,
      and(eq(sprintSurvey.id, sprintSurveyAnswerProject.sprintSurveyId)),
    )
    .where(
      and(
        eq(projectMember.userId, userId), // the surveys belong to a user's project
        eq(sprintSurveyAnswerProject.userId, userId),
        eq(sprintSurvey.processed, false), // the surveys aren't processed
        gte(sql`${currentDateTimeString}`, sprintSurvey.scheduledAt), // the survey itself is active (i.e. has been scheduled)
      ),
    );
  if (sprintSurveys.length > 0) {
    for (const sprintSurvey of sprintSurveys) {
      if (!(sprintSurvey.answerUserId === userId)) {
        notifications.push({
          ...sprintSurvey,
          type: "SPRINT",
        });
      }
    }
  }

  // Get the notifications of the final surveys
  const finalSurveys = await db
    .select({
      id: finalSurvey.id,
      projectName: project.name,
      date: finalSurvey.scheduledAt,
      answerUserId: finalSurveyAnswer.userId,
    })
    .from(finalSurvey)
    .innerJoin(project, eq(project.id, finalSurvey.projectId))
    .innerJoin(projectMember, eq(projectMember.projectId, project.id))
    .leftJoin(
      finalSurveyAnswer,
      and(eq(finalSurvey.id, finalSurveyAnswer.finalSurveyId)),
    )
    .where(
      and(
        eq(projectMember.userId, userId), // the surveys belong to a user's project
        eq(finalSurvey.processed, false), // the surveys aren't processed
        gte(sql`${currentDateTimeString}`, finalSurvey.scheduledAt), // the survey itself is active (i.e. has been scheduled)
      ),
    );

  if (finalSurveys.length > 0) {
    for (const finalSurvey of finalSurveys) {
      if (!(finalSurvey.answerUserId === userId)) {
        notifications.push({
          ...finalSurvey,
          type: "FINAL",
        });
      }
    }
  }

  // Get the notifications of the ruler surveys
  const rulerSurveys = await db
    .select()
    .from(rulerSurveyAnswers)
    .where(
      and(
        eq(rulerSurveyAnswers.userId, userId), // the survey belongs to the user
        eq(rulerSurveyAnswers.answeredAt, sql`${currentDateString}`), // is today's survey
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
