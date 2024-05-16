"use server";
import { auth } from "@/auth";
import db from "@/db/drizzle";
import { rulerSurveyAnswers } from "@/db/schema";
import { sql } from "drizzle-orm";

import { RulerSurveyAnswer } from "@/types/types";

export async function submitRulerSurveyAnswer(surveyAnswer: RulerSurveyAnswer) {
  // Insert ruler answer to db
  await db.insert(rulerSurveyAnswers).values({
    userId: surveyAnswer.userId,
    emotionId: surveyAnswer.emotion?.id,
    answeredAt: sql`CURRENT_TIMESTAMP`,
    comment: surveyAnswer.comment,
  });
}
