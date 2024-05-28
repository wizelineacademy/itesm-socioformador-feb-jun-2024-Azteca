"use server";

import db from "@/db/drizzle";
import { rulerEmotion, rulerSurveyAnswers } from "@/db/schema";
import { eq } from "drizzle-orm";

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

  // Calculate the percentage of emotions in each quadrant
  const percentages = {
    quadrant1: Math.round((quadrant1 / totalEmotions) * 100 * 100) / 100,
    quadrant2: Math.round((quadrant2 / totalEmotions) * 100 * 100) / 100,
    quadrant3: Math.round((quadrant3 / totalEmotions) * 100 * 100) / 100,
    quadrant4: Math.round((quadrant4 / totalEmotions) * 100 * 100) / 100,
  };

  return percentages;
}
