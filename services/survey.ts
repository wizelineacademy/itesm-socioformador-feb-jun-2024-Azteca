"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import {
  sprintSurvey,
  sprintSurveyAnswerCoworkers,
  sprintSurveyAnswerProject,
  finalSurvey,
  finalSurveyAnswer,
  rulerSurvey,
  rulerSurveyAnswers,
} from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { SprintSurveyAnswer, SurveyStepTwoAnswer } from "@/types";

export async function submitSprintSurveyAnswers(
  surveyAnswer: SprintSurveyAnswer,
) {
  // Insert Project Answers
  await db.insert(sprintSurveyAnswerProject).values(
    surveyAnswer.projectAnswers.map((projAns) => ({
      userId: surveyAnswer.userId,
      sprintSurveyId: surveyAnswer.sprintSurveyId,
      questionName: projAns.questionKey,
      answer: projAns.answer,
    })),
  );
  // Insert Cokorkers Answers
  surveyAnswer.coworkersAnswers.forEach((answer) => {
    submitSprintCoworkersAns(
      surveyAnswer.userId,
      surveyAnswer.sprintSurveyId,
      answer,
    );
  });
}

async function submitSprintCoworkersAns(
  userId: string,
  surveyId: number,
  questions: {
    questionKey: keyof SurveyStepTwoAnswer;
    answers: Array<{ coworkerId: string; answer: number }>;
  },
) {
  await db.insert(sprintSurveyAnswerCoworkers).values(
    questions.answers.map((coworkerAns) => ({
      userId: userId,
      sprintSurveyId: surveyId,
      questionName: questions.questionKey,
      coworkerId: coworkerAns.coworkerId,
      answer: coworkerAns.answer,
    })),
  );
}
