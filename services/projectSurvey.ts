"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { finalSurvey, finalSurveyAnswer } from "@/db/schema";
import { sql } from "drizzle-orm";
import { ProjectAnswer } from "@/types/types";

export async function createProjectSurvey(projectId: number) {
  const res = await db
    .insert(finalSurvey)
    .values({ scheduledAt: sql`CURRENT_TIMESTAMP`, projectId: projectId })
    .returning({ id: finalSurvey.id });

  return res[0];
}

export async function submitProjectAnswer(answers: ProjectAnswer) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You most be signed in");
  }
  await db.insert(finalSurveyAnswer).values(
    answers.answers.map((item) => ({
      userId: userId,
      finalSurveyId: answers.finalSurveyId,
      questionId: item.questionKey,
      answer: item.answer,
      comment: "",
    })),
  );
  await db.insert(finalSurveyAnswer).values({
    userId: userId,
    finalSurveyId: answers.finalSurveyId,
    questionId: 17,
    answer: null,
    comment: answers.comment,
  });
}
