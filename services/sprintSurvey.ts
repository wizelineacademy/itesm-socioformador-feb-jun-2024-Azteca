"use server";
import { auth } from "@/auth";
import db from "@/db/drizzle";
import {
  question,
  sprintSurvey,
  sprintSurveyAnswerCoworkers,
  sprintSurveyAnswerProject,
  projectMember,
  finalSurveyAnswer,
} from "@/db/schema";
import { eq, or, sql, and, inArray } from "drizzle-orm";

import {
  Questions,
  SprintSurveyAnswer,
  SurveyStepTwoAnswer,
} from "@/types/types";

type GrowthDataResult = {
  month: number;
  averageAnswer: number;
};

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
  const answeredAt = new Date(
    new Date().toLocaleString("es-MX", { timeZone: "America/Monterrey" }),
  );

  const res = await db
    .insert(sprintSurvey)
    .values({ projectId: projectId, scheduledAt: answeredAt })
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
      manager_support: sql`AVG(${sprintSurveyAnswerProject.answer}) * 10`.as(
        "manager_support",
      ),
    })
    .from(sprintSurveyAnswerProject)
    .innerJoin(
      projectMember,
      eq(sprintSurveyAnswerProject.userId, projectMember.userId),
    )
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(sprintSurveyAnswerProject.questionId, 27),
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

  const coworkerSupport = Math.round(
    Number(coworkerSupportResult[0]?.coworker_support ?? 0),
  );

  return {
    communication,
    motivation,
    punctuality,
    managerSupport,
    coworkerSupport,
  };
}
export async function getDetailedProjectStatistics(projectId: number) {
  // Obtener el promedio de respuestas para "Listening Feeling"
  const listeningFeelingResult = await db
    .select({
      listeningFeeling: sql`AVG(${finalSurveyAnswer.answer}) * 10`.as(
        "listeningFeeling",
      ),
    })
    .from(finalSurveyAnswer)
    .innerJoin(
      projectMember,
      eq(finalSurveyAnswer.userId, projectMember.userId),
    )
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(finalSurveyAnswer.questionId, 36),
      ),
    );

  const listeningFeeling = Math.round(
    Number(listeningFeelingResult[0]?.listeningFeeling ?? 0),
  );

  // Obtener el promedio de respuestas para "Recognition Feeling"
  const recognitionFeelingResult = await db
    .select({
      recognitionFeeling: sql`AVG(${finalSurveyAnswer.answer}) * 10`.as(
        "recognitionFeeling",
      ),
    })
    .from(finalSurveyAnswer)
    .innerJoin(
      projectMember,
      eq(finalSurveyAnswer.userId, projectMember.userId),
    )
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(finalSurveyAnswer.questionId, 35),
      ),
    );

  const recognitionFeeling = Math.round(
    Number(recognitionFeelingResult[0]?.recognitionFeeling ?? 0),
  );

  // Obtener el promedio de respuestas para "Respect and Trust Environment"
  const respectTrustEnvironmentResult = await db
    .select({
      respectTrustEnvironment: sql`AVG(${finalSurveyAnswer.answer}) * 10`.as(
        "respectTrustEnvironment",
      ),
    })
    .from(finalSurveyAnswer)
    .innerJoin(
      projectMember,
      eq(finalSurveyAnswer.userId, projectMember.userId),
    )
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(finalSurveyAnswer.questionId, 39),
      ),
    );
  const respectTrustEnvironment = Math.round(
    Number(respectTrustEnvironmentResult[0]?.respectTrustEnvironment ?? 0),
  );
  const resourcesSatisfactionResult = await db
    .select({
      resourcesSatisfaction:
        sql`AVG(${sprintSurveyAnswerProject.answer}) * 10`.as(
          "resourcesSatisfaction",
        ),
    })
    .from(sprintSurveyAnswerProject)
    .innerJoin(
      projectMember,
      eq(sprintSurveyAnswerProject.userId, projectMember.userId),
    )
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(sprintSurveyAnswerProject.questionId, 26),
      ),
    );
  const resourcesSatisfaction = Math.round(
    Number(resourcesSatisfactionResult[0]?.resourcesSatisfaction ?? 0),
  );

  return {
    listeningFeeling,
    recognitionFeeling,
    respectTrustEnvironment,
    resourcesSatisfaction,
  };
}

export const getGrowthData = async (projectId: number) => {
  const growthSupportQuestions = [27, 37, 38]; // Preguntas relacionadas con soporte de crecimiento
  const growthOpportunitiesQuestions = [37, 38]; // Preguntas relacionadas con oportunidades de crecimiento

  // Obtener los datos de soporte de crecimiento
  const growthSupportDataResults = (await db
    .select({
      month: sql`EXTRACT(MONTH FROM ${finalSurveyAnswer.answeredAt})`.as(
        "month",
      ),
      averageAnswer: sql`AVG(${finalSurveyAnswer.answer})`.as("averageAnswer"),
    })
    .from(finalSurveyAnswer)
    .innerJoin(
      projectMember,
      eq(finalSurveyAnswer.userId, projectMember.userId),
    )
    .where(
      and(
        eq(projectMember.projectId, projectId),
        inArray(finalSurveyAnswer.questionId, growthSupportQuestions),
      ),
    )
    .groupBy(sql`EXTRACT(MONTH FROM ${finalSurveyAnswer.answeredAt})`)
    .execute()) as GrowthDataResult[]; // Asignar el tipo explícitamente

  const growthSupportData = growthSupportDataResults.map((result) => ({
    month: result.month,
    averageAnswer: result.averageAnswer,
  }));

  // Obtener los datos de oportunidades de crecimiento
  const growthOpportunitiesDataResults = (await db
    .select({
      month: sql`EXTRACT(MONTH FROM ${finalSurveyAnswer.answeredAt})`.as(
        "month",
      ),
      averageAnswer: sql`AVG(${finalSurveyAnswer.answer})`.as("averageAnswer"),
    })
    .from(finalSurveyAnswer)
    .innerJoin(
      projectMember,
      eq(finalSurveyAnswer.userId, projectMember.userId),
    )
    .where(
      and(
        eq(projectMember.projectId, projectId),
        inArray(finalSurveyAnswer.questionId, growthOpportunitiesQuestions),
      ),
    )
    .groupBy(sql`EXTRACT(MONTH FROM ${finalSurveyAnswer.answeredAt})`)
    .execute()) as GrowthDataResult[]; // Asignar el tipo explícitamente

  const growthOpportunitiesData = growthOpportunitiesDataResults.map(
    (result) => ({
      month: result.month,
      averageAnswer: result.averageAnswer,
    }),
  );

  return {
    growthSupportData,
    growthOpportunitiesData,
  };
};
