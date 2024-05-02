"use server";
import dotenv from "dotenv";
import OpenAI from "openai";
import db from "@/db/drizzle";
import { and, eq, gte, lte, isNull, sql } from "drizzle-orm";
import { auth } from "@/auth";
import similarity from "compute-cosine-similarity";

import {
  pipTask,
  pipResource,
  project,
  projectMember,
  sprintSurvey,
  sprintSurveyAnswerCoworkers,
  sprintSurveyAnswerProject,
} from "@/db/schema";

/*
  This function calculates the cosine similarity between the query and the resources,
  it returns the resources with the highest similarity
*/
async function cosine_similarity(feedback: string) {
  const resourcesSimilarity = [];
  const allResources = await db.select().from(pipResource);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: feedback,
    encoding_format: "float",
  });

  const feedbackEmbedding = response.data[0].embedding;

  // calculate the cosine similarity between the feedback and the resources
  for (let resource of allResources) {
    var resourceSimilarity = similarity(feedbackEmbedding, resource.embedding!);
    resourcesSimilarity.push([resourceSimilarity, resource.id]);
  }

  // sort the resources by similarity in descending order
  resourcesSimilarity.sort((a, b) => b[0]! - a[0]!);
  return resourcesSimilarity;
}

// This functino processes the open feedback of the user and returns a summary of the feedback
async function process_open_feedback(feedback: string) {
  const sentences = feedback.split(".");
  for (let sentence of sentences) {
    const wordsPerSentence: number[] = [];
  }

  // split positive, negative and neutral feedback
}

// This function performs the analysis of the closed feedback
async function process_closed_feedback() {}

/*
  This function groups all the feedback received in a custom structure.
  Output:
  {
    coworkerId_1: {
      openFeedback: { ... },
      closedFeedback: { ... }
    },
    coworkerId_2: { .... },
    ....,
    coworkerId_n: { ... }
  }
*/
async function group_feedback(sprintSurveyId: number, uniqueWorkers: string[]) {
  interface FeedbackCategory {
    openFeedback: Array<[string, string]>;
    closedFeedback: Array<[string, number]>;
  }

  const feedbackRecords: {
    [userId: string]: { [coworkerId: string]: FeedbackCategory };
  } = {};

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
        eq(sprintSurvey.id, sprintSurveyId),
      ),
    );

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
    .where(
      and(
        isNull(sprintSurveyAnswerCoworkers.comment),
        eq(sprintSurvey.id, sprintSurveyId),
      ),
    );

  for (let userId of uniqueWorkers) {
    var filteredCoworkers = uniqueWorkers.filter(
      (element): element is string =>
        typeof element === "string" && element !== userId,
    );

    feedbackRecords[userId] = {};

    for (let coworkerId of filteredCoworkers) {
      feedbackRecords[userId][coworkerId] = {
        openFeedback: [],
        closedFeedback: [],
      };
    }
  }

  coworkersOpenFeedback.forEach((record) => {
    if (record.coworkerId !== null && record.coworkerId !== undefined) {
      feedbackRecords[record.userId!][record.coworkerId].openFeedback.push([
        record.questionName!,
        record.comment!,
      ]);
    }
  });

  coworkersClosedFeedback.forEach((record) => {
    if (record.coworkerId !== null && record.coworkerId !== undefined) {
      feedbackRecords[record.userId!][record.coworkerId].closedFeedback.push([
        record.questionName!,
        record.answer!,
      ]);
    }
  });

  return feedbackRecords;
}

// This function creates the embeddings of all the new resources without embeddings
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

// This function analyzes the feedback of the user and creates new resources depending on the answers
export async function ruler_analysis() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  // recommend resources only if the mood of the user is negative, check the previous resources recommended to experiment
}

// This function is triggered by the manager when the sprint survey is closed
export async function feedback_analysis(sprintSurveyId: number) {
  const today = new Date().toISOString().slice(0, 10);

  // get all the unique users that belong to the project of the sprint survey
  const uniqueUsers = await db
    .select({
      userId: projectMember.userId,
    })
    .from(sprintSurvey)
    .innerJoin(project, eq(project.id, sprintSurvey.projectId))
    .innerJoin(projectMember, eq(projectMember.projectId, project.id));

  const ids = uniqueUsers.map((user) => user.userId as string);

  // feedback ordered, this structure is important to detect similarities between the feedback
  const orderedFeedback = await group_feedback(sprintSurveyId, ids);
}
