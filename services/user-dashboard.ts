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
