"use server";
import dotenv from "dotenv";
import OpenAI from "openai";
import db from "@/db/drizzle";
import { and, eq, gte, lte } from "drizzle-orm";
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

/*
 This function creates the embeddings of the new resources added to the database
*/
export async function create_embedding() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  /*
    Embeddings models: 
      "text-embedding-3-small" - maxEmbeddingSize=1536
      "text-embedding-ada-002" - maxEmbeddingSize=1536
      "text-embedding-3-large" - maxEmbeddingSize=3072
  */
  const allResources = await db
    .select()
    .from(pipResource)
    .where(eq(pipResource.embedding, []));

  for (let resource of allResources) {
    const description = resource.description as string;
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: description,
      encoding_format: "float",
    });

    // store the embedding as a string, velocity is sacrified by the space saved
    const stringArray = response.data[0].embedding.map((num) => num.toString());

    await db
      .update(pipResource)
      .set({ embedding: stringArray })
      .where(eq(pipResource.id, resource.id))
      .execute();
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
 This function is triggered each time a sprint surey is finished to get the feedback of the user and to recommend the best resources and tasks
*/
export async function pip_selection() {
  const today = new Date().toISOString().slice(0, 10);

  // get the last sprint surveys of all the projects
  const sprintSurveys = await db
    .select({
      projectId: project.id,
      sprintSurveyId: sprintSurvey.id,
    })
    .from(project)
    .innerJoin(sprintSurvey, eq(project.id, sprintSurvey.projectId));

  // analyze the feedback of each sprint survey
  for (let survey of sprintSurveys) {
    const coworkersFeedback = await db
      .select({
        userId: sprintSurveyAnswerCoworkers.userId,
        coworkerId: sprintSurveyAnswerCoworkers.coworkerId,
        questionName: sprintSurveyAnswerCoworkers.questionName,
        answer: sprintSurveyAnswerCoworkers.answer,
      })
      .from(sprintSurvey)
      .innerJoin(
        sprintSurveyAnswerCoworkers,
        eq(sprintSurveyAnswerCoworkers.sprintSurveyId, survey.sprintSurveyId),
      );

    const userFeedback = await db
      .select({
        userId: sprintSurveyAnswerProject.userId,
        questionName: sprintSurveyAnswerProject.questionName,
        answer: sprintSurveyAnswerProject.answer,
      })
      .from(sprintSurvey)
      .innerJoin(
        sprintSurveyAnswerProject,
        eq(sprintSurveyAnswerProject.sprintSurveyId, survey.sprintSurveyId),
      );

    // count the total tokens of all the feedback received from the coworkers

    // count the total tokens of the sprint answers of the user

    // clasify comments into positve and negative, biases are classified as negative (comments related to race, skin color, beliefs, gender, sexual preferences, insults) the user is stored and the comment

    // the negative comments are joined in a single string to create the embedding

    // limit the input to the maximum amount of tokens permitted

    // the positive comments are turned into kudos
  }
}

/*
 This function creates the tasks of the user that complement the resources chosen for his pip,
 they are meant to be different than the resources selected
*/
export async function create_tasks() {
  // choose the resources selected after the 5th position
  // if the resources are very different from the original feedback then the tasks are made with the selected resources
  // Create the tasks based with the type of the resource (book, video, documental, visit family), the job that must be accomplished (read N pages, read a chapter, visit my family, excercise) and the favorite format of the user (book, video, documental, visit family)
  // Check if the new tasks are related or are very similar to the previous tasks of the user, if this is the case the new task has a custom color indicating that it has been selected more than once
}
