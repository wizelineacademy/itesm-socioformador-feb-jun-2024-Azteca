"use server";
import dotenv from "dotenv";
import OpenAI from "openai";
import db from "@/db/drizzle";
import { and, count, eq, gte, lte, isNull, sql } from "drizzle-orm";
import { auth } from "@/auth";
import similarity from "compute-cosine-similarity";

import {
  pipTask,
  pipResource,
  project,
  projectMember,
  rulerEmotion,
  sprintSurvey,
  sprintSurveyAnswerCoworkers,
  sprintSurveyAnswerProject,
  userResource,
} from "@/db/schema";

interface FeedbackCategory {
  [coworkerId: string]: {
    openFeedback: string;
    closedFeedback: Array<[number, number]>;
  };
}

interface FeedbackClassifications {
  positive: { [sentiment: string]: string[] };
  negative: { [sentiment: string]: string[] };
  biased: { [sentiment: string]: string[] };
  notUseful: { [sentiment: string]: string[] };
}

interface FeedbackRecords {
  [userId: string]: {
    coworkersFeedback: FeedbackCategory;
    feedbackClassifications: FeedbackClassifications;
  };
}

async function cosine_similarity(feedback: string) {
  const resourcesSimilarity: [GLfloat, Number][] = [];
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
    var resourceSimilarity: GLfloat = similarity(
      feedbackEmbedding,
      resource.embedding!,
    )!;
    resourcesSimilarity.push([resourceSimilarity, resource.id]);
  }

  // sort the resources by similarity in descending order
  resourcesSimilarity.sort((a, b) => b[0]! - a[0]!);

  resourcesSimilarity.splice(5);

  // return only the resources ids
  const resourcesId: number[] = resourcesSimilarity
    .map(([_, second]) => second)
    .filter((value): value is number => value !== null);
  return resourcesId;
}

async function create_tasks(feedback: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const tasksInstructions: string = `Dado el siguiente párrafo con comentarios que evalúan una persona, crea tareas simples para la persona evaluada para mejorar su rendimiento o bienestar. Las tareas deben ser claras y concizas, deben estar relacionadas al comentario recibido, deben ser tareas simples que no tomen mucho tiempo al usuario pero que le permiten mejorar en su rendimiento o bienestar. Algunos ejemplos de tareas pueden ser "Hacer ejercicio", "Ir con el psicólogo", "Meditar", "Dormir 8 horas diarias", "Comer frutas y verduras", "Visitar a mi familia", etc., pero cuida que sean relacionadas al feedback recibido, que sean sencilas y que sean diferentes.

  Hay otras indicaciones muy importantes que debes seguir por cada tarea:
  1. Cada tarea debe llevar un título y una descripción.
  2. El título no debe superar los 64 caracteres y la descripción no debe superar los 256 caracteres.
  3. Al crear ya sea el título o la descripción de cada tarea no debes usar nunca los caracteres "\n" ni ":" porque esos son caracteres especiales que yo te indicaré donde usar.
  4. Vas a juntar el título de cada tarea con la descripción donde el separador de en medio es el caracter ":" sin espacios en blanco entre todos los caracteres, solo en el mensaje del título y de la descripción.
  5. Vas a unir las estructuras de todas las tareas con el caracter "\n" como separador sin espacios en blanco entre la estructura de cada tarea y ese separador.
  6. La siguiente estructura es ilustrativa de cómo debes regresar el resultado con las 5 tareas, fíjate en estructura no tanto en el contenido:
  """
  titulo_1:descripción_1\ntitulo_2:descripcion_2
  """`;

  const rawTasks = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: tasksInstructions,
      },
      {
        role: "user",
        content: feedback,
      },
    ],
  });

  // clean the results of the generated tasks
  const tasks = rawTasks.choices[0].message.content!.split("\n");
  const cleanedTasks = tasks.filter((element) => element !== "");
  return cleanedTasks;
}

async function process_open_feedback(userFeedback: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const classificationInstructions: string = `El siguiente query es un párrafo que contiene feedback de un usuario a otro. Realiza las siguientes instrucciones:
  1. Identifica las ideas claves de todo el párrafo, sepáralo por cada idea tomando en cuenta la coherencia entre las oraciones y las ideas que expresan guardando la conexión del asunto, puedes ignorar signos de puntuación si una misma oración une ideas diferentes, pero tu prioridad es separar las oraciones con ideas atómicas.
  2. De las oraciones agrupadas por ideas, sepáralas en las siguientes 4 clasificaciones de sentimientos, tomando en cuenta la descripción de cada una:
    * positive: cualquier cumplido, elogio o felicitación a la persona que recibe el comentario o a su desempeño en el trabajo. Las críticas constructivas si bien son una forma saludable de dar retroalimentación no cuentan como comentario positivo porque destacan una necesidad de la persona evaluada.
    * negative: cualquier comentario relacionado con críticas constructivas o áreas de mejora en las habilidades de la persona y en su desempeño laboral. Si hay un comentario relacionado con la inteligencia emocional o una crítica a al carácter de la persona sé muy cauteloso y presta atención si el comentario es objetivo y si habla con hechos, ya que es posible que pueda involucrar un ataque personal, tómalo como un comentario constructivo si brinda hechos e información de forma objetiva.
    * biased: cualquier comentario o crítica relacionada con la raza, color de piel, creencias, sexo, preferencias sexuales de la persona evaluada o comentarios con insultos y ataques personales. No es lo mismo que un comentario negativo porque no es imparcial.
    * notUseful: cualquier comentario que no sea positivo, ni negativo, ni sesgado, ni aporte ningún tipo de valor a las clasificaciones previas.
  3. En cada una de las 4 clasificaciones de sentimiento une todas las oraciones en un párrafo. Al unir las oraciones de cada clasificación debe haber una conexión clara entre las ideas, pero es posible que en la unión no haya coherencia gramatical o por signos de puntuación, si ese es el caso puedes modificar ligeramente las palabras o signos para unir todas las oraciones en un párrafo de la clasificación en cuestión, pero no alteres el contenido del mensaje que expresan.
  4. Separa las 4 clasificaciones con el separador "\n\n" que solo puede aparecer entre la clasificación de cada sentimiento, no en el párrafo formado de oraciones de cada clasificación.
  5. Si hay clasificaciones de sentimientos que no cuentan con ninguna oración porque ninguna cayó en esa categoría, aun así incluye el nombre del sentimiento con el separador definido en el paso anterior.
  6. Es importante que en tu respuesta el orden de las clasificaciones de sentimientos sea el mismo en que los presenté en el paso 2.
  7. No respondas ni expliques tu procedimiento, limítate a cumplir con las instrucciones especificadas con la estructura especificada, haz el análisis de todo el contenido del texto sin dejar oraciones sin procesar.
  
  Este es un ejemplo del resultado esperado, la categoría 'Sesgado' se encuentra vacía porque ningún comentario encajó en las instrucciones proporcionadas de ese sentimiento y así se deben representar las categorías cuando ningún comentario pertenezca a ella, recuerda que es solo un ejemplo, pon atención en la estructura, no tanto en el contenido:
  """
  positive: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  \n\n
  negative: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
  \n\n
  biased:
  \n\n
  notUseful: Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  """`;

  const summarizationInstructions: string =
    "El siguiente es un párrafo con comentarios negativos o críticas constructivas hacia una persona, no son ataques personales. Quiero que resumas todo el párrafo en algunas categorías, pero solo puedes usar las que yo te diga sin usar opciones afuera de esa lista y debes regresar las categorías separadas por comas y sin espacios entre cada separador, solo regresa las categorías identificadas, no todas las mencionadas, no respondas ni expliques tu procedimiento, limítate a cumplir con las instrucciones especificadas. Las clasificaciones son: Mala gestión de tiempo, Sin inteligencia emocional, Prepotencia, Soberbia, Poca creatividad, Sin iniciativa, Mala comunicación, Mal trabajo en equipo, Falta de ética, y Sin razonamiento crítico. Un ejemplo del resultado que debes regresar es `Sin iniciativa,Mala gestión de tiempo,Mal trabajo en equipo,Mala comunicación`";

  // classify the feedback into 4 categories: positive, negative, biased, not useful
  const classifiedFeedback = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: classificationInstructions,
      },
      {
        role: "user",
        content: userFeedback,
      },
    ],
  });

  // clean the results of the classification
  const sentiments =
    classifiedFeedback.choices[0].message.content!.split("\n\n");
  const cleanedSentiments = sentiments.filter((element) => element !== "");
  var negativeFeedback: string = "";
  for (let sentiment of cleanedSentiments) {
    if (sentiment.includes("negative:")) {
      negativeFeedback = sentiment.substring(10);
    }
  }

  // summarize the negative feedback to be compared with all the feedback given to the same user
  const summarizedFeedback = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: summarizationInstructions,
      },
      {
        role: "user",
        content: negativeFeedback,
      },
    ],
  });

  const summarizedFeedbackCategories =
    summarizedFeedback.choices[0].message.content!.split(",");

  return summarizedFeedbackCategories;
}

async function process_closed_feedback(answers: [number, number][]) {
  const ordinaryPerformance = 7;
  const userCategories = { goodCategories: [], badCategories: [] };

  // get the classifications of each closed question

  return userCategories;
}

async function group_feedback(sprintSurveyId: number, uniqueWorkers: string[]) {
  const feedbackRecords: FeedbackRecords = {};

  const coworkersOpenFeedback = await db
    .select({
      userId: sprintSurveyAnswerCoworkers.userId,
      coworkerId: sprintSurveyAnswerCoworkers.coworkerId,
      questionId: sprintSurveyAnswerCoworkers.questionId,
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
      questionId: sprintSurveyAnswerCoworkers.questionId,
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

  // initialize the empty structure with the keys
  for (let userId of uniqueWorkers) {
    var filteredCoworkers = uniqueWorkers.filter(
      (element): element is string =>
        typeof element === "string" && element !== userId,
    );

    feedbackRecords[userId] = {
      coworkersFeedback: {},
      feedbackClassifications: {
        positive: {},
        negative: {},
        biased: {},
        notUseful: {},
      },
    };

    for (let coworkerId of filteredCoworkers) {
      feedbackRecords[userId]["coworkersFeedback"][coworkerId] = {
        openFeedback: "",
        closedFeedback: [],
      };
    }
  }

  coworkersOpenFeedback.forEach((record) => {
    if (record.coworkerId !== null && record.coworkerId !== undefined) {
      feedbackRecords[record.userId!]["coworkersFeedback"][
        record.coworkerId
      ].openFeedback = record.comment!;
    }
  });

  coworkersClosedFeedback.forEach((record) => {
    if (record.coworkerId !== null && record.coworkerId !== undefined) {
      feedbackRecords[record.userId!]["coworkersFeedback"][
        record.coworkerId
      ].closedFeedback.push([record.questionId!, record.answer!]);
    }
  });

  return feedbackRecords;
}

async function set_resources_embeddings() {
  try {
    const noEmbeddingResources = await db
      .select()
      .from(pipResource)
      .where(sql`embedding::text = '[]'`);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });

    for (let resource of noEmbeddingResources) {
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

export async function ruler_analysis() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  // recommend resources only if the mood of the user is negative, check the previous resources recommended to experiment
}

// Main function
export async function feedback_analysis(sprintSurveyId: number) {
  const processedSurvey = await db
    .select({ processed: sprintSurvey.processed })
    .from(sprintSurvey)
    .where(eq(sprintSurvey.id, sprintSurveyId));

  const notProcessedSurvey = !processedSurvey[0].processed;

  if (notProcessedSurvey) {
    const uniqueProjectUsers = await db
      .select({
        userId: projectMember.userId,
      })
      .from(sprintSurvey)
      .innerJoin(project, eq(project.id, sprintSurvey.projectId))
      .innerJoin(projectMember, eq(projectMember.projectId, project.id))
      .where(eq(sprintSurvey.id, sprintSurveyId));

    const ids = uniqueProjectUsers.map((user) => user.userId as string);
    const orderedFeedback = await group_feedback(sprintSurveyId, ids);

    // iterate through each unique user of the project and read the feedback received
    for (let userId of Object.keys(orderedFeedback)) {
      let userTasksCount = await db
        .select({ count: count() })
        .from(pipTask)
        .where(
          and(
            eq(pipTask.userId, userId),
            eq(pipTask.sprintSurveyId, sprintSurveyId),
          ),
        );

      let userResourcesCount = await db
        .select({ count: count() })
        .from(userResource)
        .where(
          and(
            eq(userResource.userId, userId),
            eq(userResource.sprintSurveyId, sprintSurveyId),
          ),
        );

      // safety double check if the user has been checked in case of a failure in the middle of the survey analysis
      if (userTasksCount[0].count == 0 || userResourcesCount[0].count == 0) {
        for (let coworkerId of Object.keys(
          orderedFeedback[userId]["coworkersFeedback"],
        )) {
        }

        // all feedback summarized, now get the classifications of negative feedback with the most suggestions
        const feedbackSuggestions: [number, string][] = [];
        Object.keys(
          orderedFeedback[userId].feedbackClassifications.negative,
        ).forEach((key) => {
          feedbackSuggestions.push([
            orderedFeedback[userId].feedbackClassifications.negative[key]
              .length,
            key,
          ]);
        });

        feedbackSuggestions.sort((a, b) => b[0] - a[0]);

        const feedbackToCreate = feedbackSuggestions[0][1];

        const newCoworkerId =
          orderedFeedback[userId].feedbackClassifications.negative[
            feedbackToCreate
          ][0];

        const feedbackComment =
          orderedFeedback[userId].coworkersFeedback[newCoworkerId]
            .openFeedback[0][1];

        // select the best tasks and resource
        const resources = await cosine_similarity(feedbackComment);

        const tasks = await create_tasks(feedbackComment);

        for (let task of tasks) {
          const [title, description] = task.split(":");
          await db.insert(pipTask).values({
            userId: userId,
            title: title,
            description: description,
            isDone: false,
          });
        }

        for (let resource of resources) {
          await db.insert(userResource).values({
            userId: userId,
            resourceId: resource,
          });
        }
      }
    }

    await db
      .update(sprintSurvey)
      .set({ processed: true })
      .where(eq(sprintSurvey.id, sprintSurveyId));
  }
}
