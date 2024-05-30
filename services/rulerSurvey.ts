"use server";
import db from "@/db/drizzle";
import { rulerSurveyAnswers } from "@/db/schema";
import { sql } from "drizzle-orm";

import { RulerSurveyAnswer } from "@/types/types";
import { auth } from "@/auth";

export async function submitRulerSurveyAnswer(surveyAnswer: RulerSurveyAnswer) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You most be signed in");
  }

  // Insert ruler answer to db
  await db.insert(rulerSurveyAnswers).values({
    userId: userId,
    emotionId: surveyAnswer.emotion?.id,
    answeredAt: sql`CURRENT_TIMESTAMP`,
    comment: surveyAnswer.comment,
  });
}
