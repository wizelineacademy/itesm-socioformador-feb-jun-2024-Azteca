"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { finalSurvey, finalSurveyAnswer, question } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { ProjectAnswer } from "@/types/types";

export async function getProjectQuestions() {
  const res = await db
    .select()
    .from(question)
    .where(
      or(
        eq(question.type, "FINAL_PROJECT_QUESTION"),
        eq(question.type, "FINAL_PROJECT_COMMENT"),
      ),
    );
  return res;
}

export async function createProjectSurvey(projectId: number) {
  const answeredAt = new Date(
    new Date().toLocaleString("es-MX", { timeZone: "America/Monterrey" }),
  );

  const res = await db
    .insert(finalSurvey)
    .values({ scheduledAt: answeredAt, projectId: projectId })
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
    questionId: answers.comment.questionKey,
    answer: null,
    comment: answers.comment.text,
  });
}
