"use server";
import dotenv from "dotenv";
import OpenAI from "openai";
import db from "@/db/drizzle";
import { and, eq, gte, lte, isNull, sql } from "drizzle-orm";
import { auth } from "@/auth";

import {
  pipTask,
  pipResource,
  project,
  projectMember,
  sprintSurvey,
  sprintSurveyAnswerCoworkers,
  sprintSurveyAnswerProject,
} from "@/db/schema";

import * as fs from "fs";
import { unique } from "drizzle-orm/mysql-core";

export async function set_embeddings() {
  /*
  Embeddings models: 
    "text-embedding-3-small" - maxEmbeddingSize=1536
    "text-embedding-ada-002" - maxEmbeddingSize=1536
    "text-embedding-3-large" - maxEmbeddingSize=3072
  */

  try {
    // resources without embeddings
    const resources = await db
      .select()
      .from(pipResource)
      .where(sql`embedding::text = '{}'`);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });

    for (let resource of resources) {
      const description = resource.description as string;

      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: description,
        encoding_format: "float",
      });

      const array = response.data[0].embedding;

      await db
        .update(pipResource)
        .set({ embedding: array })
        .where(eq(pipResource.id, resource.id))
        .execute();
    }
  } catch (err) {
    console.error("Error retrieving resources:", err);
  }
}

/*
  This function analyzes the feedback of the user and creates new resources depending on the answers
*/
export async function ruler_analysis() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  // recommend resources only if the mood of the user is negative, check the previous resources recommended to experiment
}

/*
  This function is triggered by the manager when the sprint survey is closed
*/
export async function feedback_analysis(sprintSurveyId: number) {
  const today = new Date().toISOString().slice(0, 10);

  // get all the unique users of the sprint survey
  const uniqueUsers = await db
    .selectDistinctOn([sprintSurveyAnswerCoworkers.userId])
    .from(sprintSurvey)
    .innerJoin(
      sprintSurveyAnswerCoworkers,
      eq(sprintSurveyAnswerCoworkers.sprintSurveyId, sprintSurveyId),
    )
    .where(isNull(sprintSurveyAnswerCoworkers.answer));

  for (let user of uniqueUsers) {
    const userId = user.sprint_survey_answer_coworkers.userId;

    console.log("===========================================");
    console.log("User ID: ", userId);

    // analyze all the open feedback of the user
    const coworkersOpenFeedback = await db
      .select({
        userId: sprintSurveyAnswerCoworkers.userId,
        coworkerId: sprintSurveyAnswerCoworkers.coworkerId,
        questionName: sprintSurveyAnswerCoworkers.questionName,
        comment: sprintSurveyAnswerCoworkers.comment,
      })
      .from(sprintSurvey)
      .innerJoin(
        sprintSurveyAnswerCoworkers,
        eq(sprintSurveyAnswerCoworkers.sprintSurveyId, sprintSurveyId),
      )
      .where(
        and(
          isNull(sprintSurveyAnswerCoworkers.answer),
          eq(sprintSurveyAnswerCoworkers.userId, userId!),
        ),
      );

    console.log(coworkersOpenFeedback);
    console.log("\n");

    // analyze all the closed feedback of the user
    const coworkersClosedFeedback = await db
      .select({
        userId: sprintSurveyAnswerCoworkers.userId,
        coworkerId: sprintSurveyAnswerCoworkers.coworkerId,
        questionName: sprintSurveyAnswerCoworkers.questionName,
        answer: sprintSurveyAnswerCoworkers.answer,
      })
      .from(sprintSurvey)
      .innerJoin(
        sprintSurveyAnswerCoworkers,
        eq(sprintSurveyAnswerCoworkers.sprintSurveyId, sprintSurveyId),
      )
      .where(isNull(sprintSurveyAnswerCoworkers.comment));
    console.log(coworkersClosedFeedback);
    console.log("===========================================");
  }

  console.log("\n\n\n");
}
