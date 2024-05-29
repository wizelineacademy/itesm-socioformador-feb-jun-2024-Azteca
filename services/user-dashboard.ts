"use server";

import db from "@/db/drizzle";
import {
  finalSurveyAnswer,
  positiveSkill,
  question,
  questionPositiveSkill,
  rulerEmotion,
  rulerSurveyAnswers,
  sprintSurveyAnswerCoworkers,
  sprintSurveyAnswerProject,
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

  if (res.length === 0) {
    throw new Error("No emotions could not be found");
  }

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
  const emotionsData = [
    {
      title: "High Energy - Unpleasant",
      percentage: Math.round((quadrant2 / totalEmotions) * 100 * 100) / 100,
      gradient: { start: "#ee824e", end: "#e14a5f" },
    },
    {
      title: "High Energy - Pleasant",
      percentage: Math.round((quadrant1 / totalEmotions) * 100 * 100) / 100,
      gradient: { start: "#f4e37c", end: "#f4b745" },
    },
    {
      title: "Low Energy - Unpleasant",
      percentage: Math.round((quadrant3 / totalEmotions) * 100 * 100) / 100,
      gradient: { start: "#92bef6", end: "#7481f7" },
    },
    {
      title: "Low Energy - Pleasant",
      percentage: Math.round((quadrant4 / totalEmotions) * 100 * 100) / 100,
      gradient: { start: "#9feba8", end: "#6bc68c" },
    },
  ];

  return emotionsData;
}

export async function getOverallStatistics(userId: string) {
  const coworkersAnswers = await db
    .select({
      userId: sprintSurveyAnswerCoworkers.coworkerId,
      answer: sprintSurveyAnswerCoworkers.answer,
      skillId: positiveSkill.id,
      skill: positiveSkill.skill,
    })
    .from(sprintSurveyAnswerCoworkers)
    .leftJoin(question, eq(sprintSurveyAnswerCoworkers.questionId, question.id))
    .leftJoin(
      questionPositiveSkill,
      eq(question.id, questionPositiveSkill.questionId),
    )
    .leftJoin(
      positiveSkill,
      eq(questionPositiveSkill.positiveSkillId, positiveSkill.id),
    )
    .where(
      and(
        eq(sprintSurveyAnswerCoworkers.coworkerId, userId),
        or(
          eq(positiveSkill.id, 20), // Motivation id
          eq(positiveSkill.id, 40), // Manager support
          eq(positiveSkill.id, 2), // Communication
          eq(positiveSkill.id, 41), // Coworker support
          eq(positiveSkill.id, 39), // Punctuality
        ),
      ),
    );

  const sprintAnswers = await db
    .select({
      userId: sprintSurveyAnswerProject.userId,
      answer: sprintSurveyAnswerProject.answer,
      skillId: positiveSkill.id,
      skill: positiveSkill.skill,
    })
    .from(sprintSurveyAnswerProject)
    .leftJoin(question, eq(sprintSurveyAnswerProject.questionId, question.id))
    .leftJoin(
      questionPositiveSkill,
      eq(question.id, questionPositiveSkill.questionId),
    )
    .leftJoin(
      positiveSkill,
      eq(questionPositiveSkill.positiveSkillId, positiveSkill.id),
    )
    .where(
      and(
        eq(sprintSurveyAnswerProject.userId, userId),
        or(
          eq(positiveSkill.id, 20), // Motivation id
          eq(positiveSkill.id, 40), // Manager support
          eq(positiveSkill.id, 2), // Communication
          eq(positiveSkill.id, 41), // Coworker support
          eq(positiveSkill.id, 39), // Punctuality
        ),
      ),
    );

  const finalAnswers = await db
    .select({
      userId: finalSurveyAnswer.userId,
      answer: finalSurveyAnswer.answer,
      skillId: positiveSkill.id,
      skill: positiveSkill.skill,
    })
    .from(finalSurveyAnswer)
    .leftJoin(question, eq(finalSurveyAnswer.questionId, question.id))
    .leftJoin(
      questionPositiveSkill,
      eq(question.id, questionPositiveSkill.questionId),
    )
    .leftJoin(
      positiveSkill,
      eq(questionPositiveSkill.positiveSkillId, positiveSkill.id),
    )
    .where(
      and(
        eq(finalSurveyAnswer.userId, userId),
        or(
          eq(positiveSkill.id, 20), // Motivation id
          eq(positiveSkill.id, 40), // Manager support
          eq(positiveSkill.id, 2), // Communication
          eq(positiveSkill.id, 41), // Coworker support
          eq(positiveSkill.id, 39), // Punctuality
        ),
      ),
    );

  let communicationMaxScore = 0;
  let communicationTotal = 0;
  let motivationTotal = 0;
  let coworkerSupportTotal = 0;
  let managerSupportTotal = 0;
  let punctualitySupportTotal = 0;

  coworkersAnswers.forEach((answer) => {
    switch (answer.skillId) {
      case 20:
        motivationTotal += 1;
        break;
      case 40:
        managerSupportTotal += 1;
        break;
      case 2:
        communicationTotal += 1;
        communicationMaxScore += 10;
        break;
      case 41:
        coworkerSupportTotal += 1;
        break;
      case 39:
        punctualitySupportTotal += 1;
        break;
    }
  });

  const radarData = [
    {
      statistic: "Communication",
      punctuation: (communicationTotal * 100) / communicationMaxScore,
    },
    { statistic: "Motivation", punctuation: 68 },
    { statistic: "Coworker Support", punctuation: 74 },
    { statistic: "Manager Support", punctuation: 85 },
    { statistic: "Punctuality", punctuation: 89 },
  ];

  return radarData;
}
