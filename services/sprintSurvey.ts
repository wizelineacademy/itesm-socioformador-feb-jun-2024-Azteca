"use server";
import { auth } from "@/auth";
import db from "@/db/drizzle";
import {
  question,
  sprintSurvey,
  sprintSurveyAnswerCoworkers,
  sprintSurveyAnswerProject,
} from "@/db/schema";
import { eq, or, sql } from "drizzle-orm";

import {
  Questions,
  SprintSurveyAnswer,
  SurveyStepTwoAnswer,
} from "@/types/types";

export async function getSprintSurveyQuestions(): Promise<Questions[]> {
  const res = await db
    .select()
    .from(question)
    .where(
      or(
        eq(question.type, "SPRINT_QUESTION"),
        eq(question.type, "COWORKER_QUESTION"),
        eq(question.type, "COWORKER_COMMENT"),
      ),
    );
  return res;
}

export async function createSprintSurvey(projectId: number) {
  const res = await db
    .insert(sprintSurvey)
    .values({ projectId: projectId, scheduledAt: sql`CURRENT_TIMESTAMP` })
    .returning({ id: sprintSurvey.id });

  return res[0];
}

export async function submitSprintSurveyAnswers(
  surveyAnswer: SprintSurveyAnswer,
) {
  // Get the User ID of the user logged
  const session = await auth();
  const userId = session?.user?.id as string;
  // Insert Project Answers
  await db.insert(sprintSurveyAnswerProject).values(
    surveyAnswer.projectAnswers.map((projAns) => ({
      userId: userId,
      sprintSurveyId: surveyAnswer.sprintSurveyId,
      questionName: projAns.questionKey,
      answer: projAns.answer,
    })),
  );
  // Insert Cokorkers Answers
  surveyAnswer.coworkersAnswers.forEach((answer) => {
    submitSprintCoworkersAns(userId, surveyAnswer.sprintSurveyId, answer);
  });

  await db.insert(sprintSurveyAnswerCoworkers).values(
    surveyAnswer.coworkersComments.map((comments) => ({
      userId: userId,
      sprintSurveyId: surveyAnswer.sprintSurveyId,
      questionName: "SS_CWCT",
      coworkerId: comments.coworkerId,
      comment: comments.comment,
    })),
  );
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
