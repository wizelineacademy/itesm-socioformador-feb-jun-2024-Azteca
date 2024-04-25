"use server";
import OpenAI from "openai";
import {
  pipTask,
  pipResource,
  project,
  projectMember,
  sprintSurvey,
  sprintSurveyAnswerCoworkers,
  sprintSurveyAnswerProject,
} from "@/db/schema";
import db from "@/db/drizzle";
import { and, eq, gte, lte } from "drizzle-orm";
import { auth } from "@/auth";

/*
 This function creates the embeddings of the new resources added to the database
*/
async function create_embedding() {
  // Alternative 1: create the embeddings of all the resources of the database (used only for the first time)
  const openai = new OpenAI();
  const resource_id = 1;
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: "Your text string goes here",
    encoding_format: "float",
  });

  console.log(embedding);

  // Alternative 2: create the embeddings of each of the new resources added to the database (one by one)
}

/*
  This function analyzes the feedback of the user and creates new resources depending on the answers
*/
async function ruler_analysis() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  // recommend resources only if the mood of the user is negative, check the previous resources recommended to experiment
}

/*
 This function is triggered each time a sprint surey is finished to get the feedback of the user and to recommend the best resources and tasks
*/
async function pip_selection() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  // 1. Get the actual project/sprint of the user
  // 2. Get the surverys of the actual sprint
  // 3. Of these surveys get the feedback received

  // get the feedback of the user of all the sprints of all the current projects

  const today = new Date().toISOString().slice(0, 10);

  /*
  const coworkersFeedback = await db
    .select({
      projectId: project.id,
      sprintSurveyId: sprintSurvey.id,
      userId: sprintSurveyAnswerProject.userId,
      coworkerId: sprintSurveyAnswerCoworkers.coworkerId,
      questionName: sprintSurveyAnswerCoworkers.questionName,
      answer: sprintSurveyAnswerCoworkers.answer,
    })
    .from(project)
    .innerJoin(sprintSurvey, eq(project.id, sprintSurvey.projectId))
    .innerJoin(sprintSurveyAnswerCoworkers, eq(sprintSurvey.id, sprintSurveyAnswerCoworkers.sprintSurveyId))
    .where(and(lte(project.startDate, today), gte(project.startDate, today)))
    .where(eq(sprintSurvey.userId, userId));
    .where(eq(sprintSurveyAnswerCoworkers.userId, userId));
  */

  /*
  const coworkersFeedback = await db
    .select({
      projectId: project.id,
      sprintSurveyId: sprintSurvey.id,
      userId: sprintSurveyAnswerProject.userId,
      coworkerId: sprintSurveyAnswerCoworkers.coworkerId,
      questionName: sprintSurveyAnswerCoworkers.questionName,
      answer: sprintSurveyAnswerCoworkers.answer,
    })
    .from(project).$dynamic()
    .innerJoin(sprintSurvey, eq(project.id, sprintSurvey.projectId))
    .innerJoin(sprintSurveyAnswerCoworkers, eq(sprintSurvey.id, sprintSurveyAnswerCoworkers.sprintSurveyId))
    .where(and(lte(project.startDate, today), gte(project.startDate, today)))
    .where(eq(sprintSurveyAnswerCoworkers.userId, userId));
  */

  // 1. unir tabla projectMember con project
  // 2. unir tabla project con sprintSurvey
  // 3. unir tabla sprintSurvey con sprintSurveyAnswerCoworkers
  // 4. donde projectMember sea igual al user_id => obtener todos los proyectos del usuario
  // 5. donde la fecha actual este dentro del rango de cada proyecto => filtrar a solo los proyectos vigentes
  // 6. donde la fecha actual este X dias despues del ultimo sprintSurvey (¿ya existen las encuestas vacias de todos los sprints a futuro del proyecto?)
  // 7. donde el id de sprintSurveyAnswerCoworkers sea igual al user_id => obtener solo los comentarios del ultimo sprint de los ultimos proyectos vigentes
  const coworkersFeedback = await db
    .select({
      projectId: project.id,
      sprintSurveyId: sprintSurvey.id,
      userId: sprintSurveyAnswerProject.userId,
      coworkerId: sprintSurveyAnswerCoworkers.coworkerId,
      questionName: sprintSurveyAnswerCoworkers.questionName,
      answer: sprintSurveyAnswerCoworkers.answer,
    })
    .from(project)
    .$dynamic()
    .innerJoin(projectMember, eq(project.id, projectMember.projectId))

  const userSprintAnswers = await db
    .select({
      projectId: project.id,
      sprintSurveyId: sprintSurvey.id,
      userId: sprintSurveyAnswerProject.userId,
      questionName: sprintSurveyAnswerProject.questionName,
      answer: sprintSurveyAnswerProject.answer,
    })
    .from(project);

  // clasify comments into positve and negative, biases are classified as negative (comments related to race, skin color, beliefs, gender, sexual preferences, insults) the user is stored and the comment

  // the negative comments are joined in a single string to create the embedding

  // limit the input to the maximum amount of tokens permitted

  // the positive comments are turned into kudos
}

/*
 This function creates the tasks of the user that complement the resources chosen for his pip,
 they are meant to be different than the resources selected
*/
async function create_tasks() {
  // choose the resources selected after the 5th position
  // if the resources are very different from the original feedback then the tasks are made with the selected resources
  // Create the tasks based with the type of the resource (book, video, documental, visit family), the job that must be accomplished (read N pages, read a chapter, visit my family, excercise) and the favorite format of the user (book, video, documental, visit family)
  // Check if the new tasks are related or are very similar to the previous tasks of the user, if this is the case the new task has a custom color indicating that it has been selected more than once
}
