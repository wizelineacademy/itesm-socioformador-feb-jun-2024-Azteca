"use server";
import { auth } from "@/auth";
import db from "@/db/drizzle";
import {
  question,
  sprintSurvey,
  sprintSurveyAnswerCoworkers,
  sprintSurveyAnswerProject,
  projectMember,
} from "@/db/schema";
import { eq, or, sql, and } from "drizzle-orm";

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

  console.log(surveyAnswer.projectAnswers);
  // Insert Project Answers
  if (surveyAnswer.projectAnswers.length > 0) {
    await db
      .insert(sprintSurveyAnswerProject)
      .values(
        surveyAnswer.projectAnswers.map((projAns) => ({
          userId: userId,
          sprintSurveyId: surveyAnswer.sprintSurveyId,
          questionId: projAns.questionId,
          answer: projAns.answer,
        })),
      )
      .catch((error) => console.log(error));
  }

  // Insert Coworkers Answers
  surveyAnswer.coworkersAnswers.forEach((answer) => {
    submitSprintCoworkersAns(userId, surveyAnswer.sprintSurveyId, answer);
  });

  if (surveyAnswer.coworkersComments.length > 0) {
    await db
      .insert(sprintSurveyAnswerCoworkers)
      .values(
        surveyAnswer.coworkersComments.map((comments) => ({
          userId: userId,
          sprintSurveyId: surveyAnswer.sprintSurveyId,
          questionId: surveyAnswer.commentId,
          coworkerId: comments.coworkerId,
          comment: comments.comment,
        })),
      )
      .catch((error) => console.log(error));
  }
}

async function submitSprintCoworkersAns(
  userId: string,
  surveyId: number,
  questions: {
    questionId: keyof SurveyStepTwoAnswer;
    answers: Array<{ coworkerId: string; answer: number }>;
  },
) {
  if (questions.answers.length > 0) {
    await db
      .insert(sprintSurveyAnswerCoworkers)
      .values(
        questions.answers.map((coworkerAns) => ({
          userId: userId,
          sprintSurveyId: surveyId,
          questionId: questions.questionId,
          coworkerId: coworkerAns.coworkerId,
          answer: coworkerAns.answer,
        })),
      )
      .catch((error) => console.log(error));
  }
}

export async function getOverallStatistics(projectId: number) {
  // Obtener el promedio de respuestas para Comunicación
  const communicationResult = await db
    .select({
      communication: sql`AVG(${sprintSurveyAnswerCoworkers.answer}) * 10`.as(
        "communication",
      ),
    })
    .from(sprintSurveyAnswerCoworkers)
    .innerJoin(
      projectMember,
      eq(sprintSurveyAnswerCoworkers.coworkerId, projectMember.userId),
    )
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(sprintSurveyAnswerCoworkers.questionId, 31),
      ),
    );

  const communication = communicationResult[0]?.communication || 0;

  // Obtener el promedio de respuestas para Motivación
  const motivationResult = await db
    .select({
      motivation: sql`AVG(${sprintSurveyAnswerCoworkers.answer}) * 10`.as(
        "motivation",
      ),
    })
    .from(sprintSurveyAnswerCoworkers)
    .innerJoin(
      projectMember,
      eq(sprintSurveyAnswerCoworkers.coworkerId, projectMember.userId),
    )
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(sprintSurveyAnswerCoworkers.questionId, 33),
      ),
    );

  const motivation = motivationResult[0]?.motivation || 0;

  // Obtener el promedio de respuestas para Puntualidad
  const punctualityResult = await db
    .select({
      punctuality: sql`AVG(${sprintSurveyAnswerCoworkers.answer}) * 10`.as(
        "punctuality",
      ),
    })
    .from(sprintSurveyAnswerCoworkers)
    .innerJoin(
      projectMember,
      eq(sprintSurveyAnswerCoworkers.coworkerId, projectMember.userId),
    )
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(sprintSurveyAnswerCoworkers.questionId, 30),
      ),
    );

  const punctuality = punctualityResult[0]?.punctuality || 0;

  // Obtener el promedio de respuestas para Soporte del Manager
  const managerSupportResult = await db
    .select({
      manager_support: sql`AVG(${sprintSurveyAnswerCoworkers.answer}) * 10`.as(
        "manager_support",
      ),
    })
    .from(sprintSurveyAnswerCoworkers)
    .innerJoin(
      projectMember,
      eq(sprintSurveyAnswerCoworkers.coworkerId, projectMember.userId),
    )
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(sprintSurveyAnswerCoworkers.questionId, 27),
      ),
    );

  const managerSupport = managerSupportResult[0]?.manager_support || 0;

  // Obtener el promedio de respuestas para Soporte de los Coworkers
  const coworkerSupportResult = await db
    .select({
      coworker_support: sql`AVG(${sprintSurveyAnswerCoworkers.answer}) * 10`.as(
        "coworker_support",
      ),
    })
    .from(sprintSurveyAnswerCoworkers)
    .innerJoin(
      projectMember,
      eq(sprintSurveyAnswerCoworkers.coworkerId, projectMember.userId),
    )
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(sprintSurveyAnswerCoworkers.questionId, 32),
      ),
    );

  const coworkerSupport = coworkerSupportResult[0]?.coworker_support || 0;

  return {
    communication,
    motivation,
    punctuality,
    managerSupport,
    coworkerSupport,
  };
}
