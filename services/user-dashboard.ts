"use server";

import db from "@/db/drizzle";
import {
  finalSurveyAnswer,
  skill,
  question,
  rulerEmotion,
  rulerSurveyAnswers,
  sprintSurveyAnswerCoworkers,
  sprintSurveyAnswerProject,
  questionSkill,
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
    userId: string | null;
    answer: number | null;
    skillId: number | null;
    skill: string | null;
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
      userId: sprintSurveyAnswerCoworkers.coworkerId,
      answer: sprintSurveyAnswerCoworkers.answer,
      skillId: skill.id,
      skill: skill.positiveSkill,
    })
    .from(sprintSurveyAnswerCoworkers)
    .leftJoin(question, eq(sprintSurveyAnswerCoworkers.questionId, question.id))
    .leftJoin(questionSkill, eq(question.id, questionSkill.questionId))
    .leftJoin(skill, eq(questionSkill.skillId, skill.id))
    .where(
      and(
        eq(sprintSurveyAnswerCoworkers.coworkerId, userId),
        or(
          eq(skill.id, 20), // Motivation id
          eq(skill.id, 40), // Manager support
          eq(skill.id, 2), // Communication
          eq(skill.id, 41), // Coworker support
          eq(skill.id, 39), // Punctuality
        ),
      ),
    );

  const sprintAnswers = await db
    .select({
      userId: sprintSurveyAnswerProject.userId,
      answer: sprintSurveyAnswerProject.answer,
      skillId: skill.id,
      skill: skill.positiveSkill,
    })
    .from(sprintSurveyAnswerProject)
    .leftJoin(question, eq(sprintSurveyAnswerProject.questionId, question.id))
    .leftJoin(questionSkill, eq(question.id, questionSkill.questionId))
    .leftJoin(skill, eq(questionSkill.skillId, skill.id))
    .where(
      and(
        eq(sprintSurveyAnswerProject.userId, userId),
        or(
          eq(skill.id, 20), // Motivation id
          eq(skill.id, 40), // Manager support
          eq(skill.id, 2), // Communication
          eq(skill.id, 41), // Coworker support
          eq(skill.id, 39), // Punctuality
        ),
      ),
    );

  const finalAnswers = await db
    .select({
      userId: finalSurveyAnswer.userId,
      answer: finalSurveyAnswer.answer,
      skillId: skill.id,
      skill: skill.positiveSkill,
    })
    .from(finalSurveyAnswer)
    .leftJoin(question, eq(finalSurveyAnswer.questionId, question.id))
    .leftJoin(questionSkill, eq(question.id, questionSkill.questionId))
    .leftJoin(skill, eq(questionSkill.skillId, skill.id))
    .where(
      and(
        eq(finalSurveyAnswer.userId, userId),
        or(
          eq(skill.id, 20), // Motivation id
          eq(skill.id, 40), // Manager support
          eq(skill.id, 2), // Communication
          eq(skill.id, 41), // Coworker support
          eq(skill.id, 39), // Punctuality
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

  console.log("SCORES: ", scores);

  console.log("FINAL DATA: ", radarData);

  return radarData;
}
