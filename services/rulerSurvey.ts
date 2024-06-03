"use server";
import db from "@/db/drizzle";
import { rulerSurveyAnswers } from "@/db/schema";
import { sql } from "drizzle-orm";

import { RulerSurveyAnswer } from "@/types/types";
import { auth } from "@/auth";

export async function submitRulerSurveyAnswer(surveyAnswer: RulerSurveyAnswer) {
  if (!surveyAnswer.userId || surveyAnswer.userId === undefined) {
    const session = await auth();
    surveyAnswer.userId = session?.user?.id;
    if (!surveyAnswer.userId) {
      throw new Error("You most be signed in");
    }
  }
  // Insert ruler answer to db
  await db.insert(rulerSurveyAnswers).values({
    userId: surveyAnswer.userId,
    emotionId: surveyAnswer.emotion?.id,
    answeredAt: sql`CURRENT_TIMESTAMP`,
    comment: surveyAnswer.comment,
  });
}
