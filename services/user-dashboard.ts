"use server";

import db from "@/db/drizzle";
import {
  finalSurveyAnswer,
  question,
  rulerEmotion,
  rulerSurveyAnswers,
  sprintSurveyAnswerCoworkers,
  sprintSurveyAnswerProject,
  questionSkill,
  pipTask,
  sprintSurvey,
  project,
  projectMember,
  finalSurvey,
} from "@/db/schema";
import { and, eq, or } from "drizzle-orm";

export async function getRulerGraphInfo(id: string) {
  const res = await db
    .select({
      answeredAt: rulerSurveyAnswers.answeredAt,
      emotionId: rulerEmotion.id,
      emotionName: rulerEmotion.name,
      emotionPleasantness: rulerEmotion.pleasantness,
      emotionEnergy: rulerEmotion.energy,
    })
    .from(rulerSurveyAnswers)
    .leftJoin(rulerEmotion, eq(rulerSurveyAnswers.emotionId, rulerEmotion.id))
    .where(eq(rulerSurveyAnswers.userId, id));

  const emotionsData = [
    {
      title: "High Energy - Unpleasant",
      percentage: 0,
      gradient: { start: "#ee824e", end: "#e14a5f" },
    },
    {
      title: "High Energy - Pleasant",
      percentage: 0,
      gradient: { start: "#f4e37c", end: "#f4b745" },
    },
    {
      title: "Low Energy - Unpleasant",
      percentage: 0,
      gradient: { start: "#92bef6", end: "#7481f7" },
    },
    {
      title: "Low Energy - Pleasant",
      percentage: 0,
      gradient: { start: "#9feba8", end: "#6bc68c" },
    },
  ];

  let quadrant1 = 0;
  let quadrant2 = 0;
  let quadrant3 = 0;
  let quadrant4 = 0;

  // Count the number of emotions in each quadrant
  res.forEach((emotion) => {
    if (emotion.emotionPleasantness == null || emotion.emotionEnergy == null) {
      throw new Error("Couldn't calculate percentage");
    }
    if (emotion.emotionPleasantness > 0 && emotion.emotionEnergy > 0) {
      quadrant1++;
    } else if (emotion.emotionPleasantness < 0 && emotion.emotionEnergy > 0) {
      quadrant2++;
    } else if (emotion.emotionPleasantness < 0 && emotion.emotionEnergy < 0) {
      quadrant3++;
    } else if (emotion.emotionPleasantness > 0 && emotion.emotionEnergy < 0) {
      quadrant4++;
    }
  });

  // Calculate the total number of emotions
  const totalEmotions = res.length;
  emotionsData[0].percentage =
    Math.round((quadrant2 / totalEmotions) * 100 * 100) / 100;
  emotionsData[1].percentage =
    Math.round((quadrant1 / totalEmotions) * 100 * 100) / 100;
  emotionsData[2].percentage =
    Math.round((quadrant3 / totalEmotions) * 100 * 100) / 100;
  emotionsData[3].percentage =
    Math.round((quadrant4 / totalEmotions) * 100 * 100) / 100;

  return emotionsData;
}

function calculateSurveyOverallStatistics(
  statistics: {
    motivationTotal: number;
    motivationMaxScore: number;

    managerSupportTotal: number;
    managerSupportMaxScore: number;

    communicationTotal: number;
    communicationMaxScore: number;

    coworkerSupportTotal: number;
    coworkerMaxScore: number;

    punctualitySupportTotal: number;
    punctualityMaxScore: number;
  },
  surveyAnswer: {
    answer: number | null;
    skillId: number | null;
  }[],
) {
  surveyAnswer.forEach((answer) => {
    switch (answer.skillId) {
      case 20:
        statistics.motivationTotal += answer.answer || 0;
        statistics.motivationMaxScore += 10;
        break;
      case 40:
        statistics.managerSupportTotal += answer.answer || 0;
        statistics.managerSupportMaxScore += 10;
        break;
      case 2:
        statistics.communicationTotal += answer.answer || 0;
        statistics.communicationMaxScore += 10;
        break;
      case 41:
        statistics.coworkerSupportTotal += answer.answer || 0;
        statistics.coworkerMaxScore += 10;
        break;
      case 39:
        statistics.punctualitySupportTotal += answer.answer || 0;
        statistics.punctualityMaxScore += 10;
        break;
    }
  });
}

export async function getOverallStatistics(userId: string) {
  const coworkersAnswers = await db
    .select({
      skillId: questionSkill.skillId,
      answer: sprintSurveyAnswerCoworkers.answer,
    })
    .from(sprintSurveyAnswerCoworkers)
    .leftJoin(question, eq(sprintSurveyAnswerCoworkers.questionId, question.id))
    .leftJoin(questionSkill, eq(question.id, questionSkill.questionId))
    .where(
      and(
        eq(sprintSurveyAnswerCoworkers.coworkerId, userId),
        or(
          eq(questionSkill.skillId, 20), // Motivation id
          eq(questionSkill.skillId, 40), // Manager support
          eq(questionSkill.skillId, 2), // Communication
          eq(questionSkill.skillId, 41), // Coworker support
          eq(questionSkill.skillId, 39), // Punctuality
        ),
      ),
    );

  const sprintAnswers = await db
    .select({
      skillId: questionSkill.skillId,
      answer: sprintSurveyAnswerProject.answer,
    })
    .from(sprintSurveyAnswerProject)
    .leftJoin(question, eq(sprintSurveyAnswerProject.questionId, question.id))
    .leftJoin(questionSkill, eq(question.id, questionSkill.questionId))
    .where(
      and(
        eq(sprintSurveyAnswerProject.userId, userId),
        or(
          eq(questionSkill.skillId, 20), // Motivation id
          eq(questionSkill.skillId, 40), // Manager support
          eq(questionSkill.skillId, 2), // Communication
          eq(questionSkill.skillId, 41), // Coworker support
          eq(questionSkill.skillId, 39), // Punctuality
        ),
      ),
    );

  const finalAnswers = await db
    .select({
      skillId: questionSkill.skillId,
      answer: finalSurveyAnswer.answer,
    })
    .from(finalSurveyAnswer)
    .leftJoin(question, eq(finalSurveyAnswer.questionId, question.id))
    .leftJoin(questionSkill, eq(question.id, questionSkill.questionId))
    .where(
      and(
        eq(finalSurveyAnswer.userId, userId),
        or(
          eq(questionSkill.skillId, 20), // Motivation id
          eq(questionSkill.skillId, 40), // Manager support
          eq(questionSkill.skillId, 2), // Communication
          eq(questionSkill.skillId, 41), // Coworker support
          eq(questionSkill.skillId, 39), // Punctuality
        ),
      ),
    );

  const scores = {
    motivationTotal: 0,
    motivationMaxScore: 0,

    managerSupportTotal: 0,
    managerSupportMaxScore: 0,

    communicationTotal: 0,
    communicationMaxScore: 0,

    coworkerSupportTotal: 0,
    coworkerMaxScore: 0,

    punctualitySupportTotal: 0,
    punctualityMaxScore: 0,
  };

  calculateSurveyOverallStatistics(scores, coworkersAnswers);
  calculateSurveyOverallStatistics(scores, sprintAnswers);
  calculateSurveyOverallStatistics(scores, finalAnswers);

  const radarData = [
    {
      statistic: "Communication",
      punctuation:
        (scores.communicationTotal * 100) / scores.communicationMaxScore,
    },
    {
      statistic: "Motivation",
      punctuation: (scores.motivationTotal * 100) / scores.motivationMaxScore,
    },
    {
      statistic: "Coworker Support",
      punctuation:
        (scores.coworkerSupportTotal * 100) / scores.coworkerMaxScore,
    },
    {
      statistic: "Manager Support",
      punctuation:
        (scores.managerSupportTotal * 100) / scores.managerSupportMaxScore,
    },
    {
      statistic: "Punctuality",
      punctuation:
        (scores.punctualitySupportTotal * 100) / scores.punctualityMaxScore,
    },
  ];

  return radarData;
}

// calculates for graphs productivity, self perception level, stress level
export async function getProductivityScore(userId: string) {
  const coworkersAnswers = await db
    .select({
      userId: sprintSurveyAnswerCoworkers.coworkerId,
      answer: sprintSurveyAnswerCoworkers.answer,
      skillId: questionSkill.skillId,
    })
    .from(sprintSurveyAnswerCoworkers)
    .leftJoin(question, eq(sprintSurveyAnswerCoworkers.questionId, question.id))
    .leftJoin(questionSkill, eq(question.id, questionSkill.questionId))
    .where(
      and(
        eq(sprintSurveyAnswerCoworkers.coworkerId, userId),
        eq(questionSkill.skillId, 42),
      ),
    );

  const sprintAnswers = await db
    .select({
      userId: sprintSurveyAnswerProject.userId,
      answer: sprintSurveyAnswerProject.answer,
      skillId: questionSkill.skillId,
    })
    .from(sprintSurveyAnswerProject)
    .leftJoin(question, eq(sprintSurveyAnswerProject.questionId, question.id))
    .leftJoin(questionSkill, eq(question.id, questionSkill.questionId))
    .where(
      and(
        eq(sprintSurveyAnswerProject.userId, userId),
        eq(questionSkill.skillId, 42),
      ),
    );

  const finalAnswers = await db
    .select({
      userId: finalSurveyAnswer.userId,
      answer: finalSurveyAnswer.answer,
      skillId: questionSkill.skillId,
    })
    .from(finalSurveyAnswer)
    .leftJoin(question, eq(finalSurveyAnswer.questionId, question.id))
    .leftJoin(questionSkill, eq(question.id, questionSkill.questionId))
    .where(
      and(eq(finalSurveyAnswer.userId, userId), eq(questionSkill.skillId, 42)),
    );

  let productivityTotal = 0;
  const productivityMaxScore =
    (coworkersAnswers.length + sprintAnswers.length + finalAnswers.length) * 10;

  coworkersAnswers.forEach((answer) => {
    productivityTotal += answer.answer || 0;
  });
  sprintAnswers.forEach((answer) => {
    productivityTotal += answer.answer || 0;
  });
  finalAnswers.forEach((answer) => {
    productivityTotal += answer.answer || 0;
  });
  const productivityScore = Math.round(
    (productivityTotal / productivityMaxScore) * 100,
  );

  return productivityScore;
}

export async function getPCPStatus(userId: string) {
  const pcpTasks = await db
    .select({
      status: pipTask.status,
    })
    .from(pipTask)
    .where(eq(pipTask.userId, userId));
  const totalTasks = pcpTasks.length;
  let completedTasks = 0;
  pcpTasks.forEach((task) => {
    if (task.status === "IN_PROGRESS") {
      completedTasks += 0.5;
    } else if (task.status === "DONE") {
      completedTasks += 1;
    }
  });

  let pcpCompletition = 0;
  if (completedTasks != 0) {
    pcpCompletition =
      Math.round(((completedTasks * 100) / totalTasks) * 100) / 100;
  }

  const data = {
    percentage: pcpCompletition,
    type: "full",
    gradient: { start: "#4598FB", end: "#6640D5" },
  };
  return data;
}

export async function getSelfPerceptionScore(userId: string) {
  const coworkersAnswers = await db
    .select({
      userId: sprintSurveyAnswerCoworkers.coworkerId,
      answer: sprintSurveyAnswerCoworkers.answer,
      skillId: questionSkill.skillId,
    })
    .from(sprintSurveyAnswerCoworkers)
    .leftJoin(question, eq(sprintSurveyAnswerCoworkers.questionId, question.id))
    .leftJoin(questionSkill, eq(question.id, questionSkill.questionId))
    .where(
      and(
        eq(sprintSurveyAnswerCoworkers.coworkerId, userId),
        eq(questionSkill.skillId, 43),
      ),
    );

  const finalAnswers = await db
    .select({
      userId: finalSurveyAnswer.userId,
      answer: finalSurveyAnswer.answer,
      skillId: questionSkill.skillId,
    })
    .from(finalSurveyAnswer)
    .leftJoin(question, eq(finalSurveyAnswer.questionId, question.id))
    .leftJoin(questionSkill, eq(question.id, questionSkill.questionId))
    .where(
      and(eq(finalSurveyAnswer.userId, userId), eq(questionSkill.skillId, 43)),
    );

  const questionsMaxScore =
    (coworkersAnswers.length + finalAnswers.length) * 10;
  let questionsTotal = 0;

  coworkersAnswers.forEach((answer) => {
    questionsTotal += answer.answer || 0;
  });
  finalAnswers.forEach((answer) => {
    questionsTotal += answer.answer || 0;
  });

  const emotions = await db
    .select({
      answeredAt: rulerSurveyAnswers.answeredAt,
      emotionId: rulerEmotion.id,
      emotionName: rulerEmotion.name,
      emotionPleasantness: rulerEmotion.pleasantness,
      emotionEnergy: rulerEmotion.energy,
    })
    .from(rulerSurveyAnswers)
    .leftJoin(rulerEmotion, eq(rulerSurveyAnswers.emotionId, rulerEmotion.id))
    .where(eq(rulerSurveyAnswers.userId, userId));

  const totalEmotions = emotions.length * 10;
  let goodSelfPerceptionScore = 0;

  emotions.forEach((answer) => {
    if (answer.emotionPleasantness == null) {
      goodSelfPerceptionScore = goodSelfPerceptionScore;
    } else if (answer.emotionPleasantness > 0) {
      goodSelfPerceptionScore += 10;
    }
  });

  const totalSelfPerceptionScore = Math.round(
    ((questionsTotal + goodSelfPerceptionScore) * 100) /
      (questionsMaxScore + totalEmotions),
  );

  return totalSelfPerceptionScore;
}

// Function to calculate stress score based on energy and pleasantness
function calculateStressScore(energy: number, pleasantness: number) {
  const idealEnergy = 0;
  const idealPleasantness = 6;
  const maxDistance = Math.sqrt(
    Math.pow(6 - idealEnergy, 2) + Math.pow(-6 - idealPleasantness, 2),
  );

  const distance = Math.sqrt(
    Math.pow(energy - idealEnergy, 2) +
      Math.pow(pleasantness - idealPleasantness, 2),
  );
  const stressScore = (distance / maxDistance) * 100;

  return stressScore;
}

export async function getStressScore(userId: string) {
  const emotions = await db
    .select({
      emotionPleasantness: rulerEmotion.pleasantness,
      emotionEnergy: rulerEmotion.energy,
    })
    .from(rulerSurveyAnswers)
    .leftJoin(rulerEmotion, eq(rulerSurveyAnswers.emotionId, rulerEmotion.id))
    .where(eq(rulerSurveyAnswers.userId, userId));

  const totalStressScore = emotions.reduce((sum, emotion) => {
    const { emotionEnergy, emotionPleasantness } = emotion;
    if (emotionEnergy == null || emotionPleasantness == null) {
      return sum;
    }
    const stressScore = calculateStressScore(
      emotionEnergy,
      emotionPleasantness,
    );
    return sum + stressScore;
  }, 0);

  const averageStressScore = totalStressScore / emotions.length;
  return Math.round(averageStressScore);
}

export async function getCalendarInfo(userId: string) {
  const finalSurveyDates = await db
    .selectDistinctOn([finalSurvey.id], {
      finalSurveyDate: finalSurvey.scheduledAt,
    })
    .from(projectMember)
    .leftJoin(project, eq(projectMember.projectId, project.id))
    .leftJoin(finalSurvey, eq(project.id, finalSurvey.projectId))
    .where(or(eq(projectMember.userId, userId), eq(project.managerId, userId)));

  const sprintSurveyDates = await db
    .selectDistinctOn([sprintSurvey.id], {
      sprintSurveyDate: sprintSurvey.scheduledAt,
    })
    .from(projectMember)
    .leftJoin(project, eq(projectMember.projectId, project.id))
    .leftJoin(sprintSurvey, eq(project.id, sprintSurvey.projectId))
    .where(or(eq(projectMember.userId, userId), eq(project.managerId, userId)));

  const rulerSurveyDates = await db
    .selectDistinct({
      rulerSurveyDate: rulerSurveyAnswers.answeredAt,
    })
    .from(rulerSurveyAnswers)
    .where(eq(rulerSurveyAnswers.userId, userId));

  const completedSurveys: { date: Date; color: string }[] = [];

  finalSurveyDates.forEach((answer) => {
    if (answer.finalSurveyDate !== null) {
      completedSurveys.push({
        date: answer.finalSurveyDate,
        color: "orange",
      });
    }
  });

  sprintSurveyDates.forEach((answer) => {
    if (answer.sprintSurveyDate !== null) {
      completedSurveys.push({
        date: answer.sprintSurveyDate,
        color: "green",
      });
    }
  });

  rulerSurveyDates.forEach((answer) => {
    if (answer.rulerSurveyDate !== null) {
      completedSurveys.push({
        date: answer.rulerSurveyDate,
        color: "blue",
      });
    }
  });
  return completedSurveys;
}
