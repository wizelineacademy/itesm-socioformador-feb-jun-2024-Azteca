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
  rulerEmotion,
  sprintSurvey,
  sprintSurveyAnswerCoworkers,
  sprintSurveyAnswerProject,
  userResource,
} from "@/db/schema";

interface FeedbackCategory {
  [coworkerId: string]: {
    openFeedback: Array<[string, string]>;
    closedFeedback: Array<[string, number]>;
  };
}

interface FeedbackSummary {
  positive: { [sentiment: string]: string[] };
  negative: { [sentiment: string]: string[] };
  biased: { [sentiment: string]: string[] };
  notUseful: { [sentiment: string]: string[] };
}

interface FeedbackRecords {
  [userId: string]: {
    coworkersFeedback: FeedbackCategory;
    feedbackSummary: FeedbackSummary;
  };
}

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

  resourcesSimilarity.splice(5);

  // return only the resources ids
  const resourcesId: number[] = resourcesSimilarity
    .map(([_, second]) => second)
    .filter((value): value is number => value !== null);
  return resourcesId;
}

// This function creates the tasks for the user based on the feedback received
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

// This function processes the open feedback of the user and returns a summary of the feedback
// feedback
async function process_open_feedback(userFeedback: FeedbackRecords) {
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
        content: feedback,
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

// This function performs the analysis of the closed feedback
async function process_closed_feedback(answers: [string, number][]) {
  const ordinaryPerformance = 7;
  const userCategories = { goodCategories: [], badCategories: [] };

  // the good and bad categories must not contradict themselves across different questions
  const categoriesPerQuestion = {
    X: { goodCategories: [], badCategories: [] },
    Y: { goodCategories: [], badCategories: [] },
    Z: { goodCategories: [], badCategories: [] },
  };

  type QuestionName = keyof typeof categoriesPerQuestion;

  for (let answer of answers) {
    let questionName: QuestionName = answer[0] as QuestionName;
    let answerValue = answer[1];

    if (answerValue > ordinaryPerformance) {
      // asign all the great categories to the user
      let questionCategories =
        categoriesPerQuestion[questionName]["goodCategories"];
      userCategories["goodCategories"].push(...questionCategories);
    } else if (answerValue < ordinaryPerformance) {
      // asign all the bad categories to the user
      let questionCategories =
        categoriesPerQuestion[questionName]["badCategories"];
      userCategories["badCategories"].push(...questionCategories);
    }
  }

  return userCategories;
}

/*
  This function groups all the feedback received in a custom structure.
  Output:
  {
    coworkerId_1: {
      coworkersFeedback: {
        coworkerId_2: {
          openFeedback: [[questionName, comment], ...],
          closedFeedback: [[questionName, answer], ...]
        },
      },
      feedbackSummary: {
        positive: {},
        negative: {},
        biased: {},
        notUseful: {}
      }
    }
  }
*/
async function group_feedback(sprintSurveyId: number, uniqueWorkers: string[]) {
  const feedbackRecords: FeedbackRecords = {};

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

  // initialize the empty structure with the keys
  for (let userId of uniqueWorkers) {
    var filteredCoworkers = uniqueWorkers.filter(
      (element): element is string =>
        typeof element === "string" && element !== userId,
    );

    feedbackRecords[userId] = {
      coworkersFeedback: {},
      feedbackSummary: {
        positive: {},
        negative: {},
        biased: {},
        notUseful: {},
      },
    };

    for (let coworkerId of filteredCoworkers) {
      feedbackRecords[userId]["coworkersFeedback"][coworkerId] = {
        openFeedback: [],
        closedFeedback: [],
      };
    }
  }

  coworkersOpenFeedback.forEach((record) => {
    if (record.coworkerId !== null && record.coworkerId !== undefined) {
      feedbackRecords[record.userId!]["coworkersFeedback"][
        record.coworkerId
      ].openFeedback.push([record.questionName!, record.comment!]);
    }
  });

  coworkersClosedFeedback.forEach((record) => {
    if (record.coworkerId !== null && record.coworkerId !== undefined) {
      feedbackRecords[record.userId!]["coworkersFeedback"][
        record.coworkerId
      ].closedFeedback.push([record.questionName!, record.answer!]);
    }
  });

  return feedbackRecords;
}

// This function creates the embeddings of all the new resources without embeddings
async function set_resources_embeddings() {
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
      .where(sql`embedding::text = '[]'`);

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
export async function feedback_analysis(sprintSurveyIds: number[]) {
  for (let sprintSurveyId of sprintSurveyIds) {
    // first check that the sprint survey hasnt been processed
    const processed = await db
      .select({ processed: sprintSurvey.processed })
      .from(sprintSurvey)
      .where(eq(sprintSurvey.id, sprintSurveyId));

    const notProcessed = !processed[0].processed;

    if (notProcessed) {
      // get all the unique users that belong to the project of the sprint survey
      const uniqueUsers = await db
        .select({
          userId: projectMember.userId,
        })
        .from(sprintSurvey)
        .innerJoin(project, eq(project.id, sprintSurvey.projectId))
        .innerJoin(projectMember, eq(projectMember.projectId, project.id))
        .where(eq(sprintSurvey.id, sprintSurveyId));

      const ids = uniqueUsers.map((user) => user.userId as string);

      // feedback ordered, this structure is important to detect similarities between the feedback
      const orderedFeedback = await group_feedback(sprintSurveyId, ids);

      // iterate through all the feedback of the sprint survey and analyze it
      for (let userId of Object.keys(orderedFeedback)) {
        for (let coworkerId of Object.keys(
          orderedFeedback[userId]["coworkersFeedback"],
        )) {
          if (
            orderedFeedback[userId]["coworkersFeedback"][coworkerId]
              .openFeedback.length > 0
          ) {
            // iterate through all the open feedback received from the coworker
            const userFeedbackSummary = await process_open_feedback(
              orderedFeedback[userId],
            );

            // add to the primary structure all the summaries of the previous function and the coworker who made the feedback
            const negativeFeedbackMap =
              orderedFeedback[userId].feedbackSummary.negative;
            for (let feedback of feedbackSummary) {
              if (feedback in negativeFeedbackMap!) {
                // the summary emotion already exists, push the actual user in that element
                orderedFeedback[userId].feedbackSummary.negative[feedback].push(
                  coworkerId,
                );
              } else {
                // the summary emotion doesnt exist, create a new element with the coworker
                orderedFeedback[userId].feedbackSummary.negative[feedback] = [
                  coworkerId,
                ];
              }
            }
          } else {
            // no open feedback received from the coworker, process closed feedback
            const answers =
              orderedFeedback[userId]["coworkersFeedback"][coworkerId]
                .closedFeedback;
            const feedbackSummary = await process_closed_feedback(answers);
          }
        }
        // all feedback summarized, now get the classifications of negative feedback with the most suggestions
        const feedbackSuggestions: [number, string][] = [];
        Object.keys(orderedFeedback[userId].feedbackSummary.negative).forEach(
          (key) => {
            feedbackSuggestions.push([
              orderedFeedback[userId].feedbackSummary.negative[key].length,
              key,
            ]);
          },
        );

        // sort the feedback suggestions by the number of suggestions in descending order
        feedbackSuggestions.sort((a, b) => b[0] - a[0]);

        // get the feedback classification with the most suggestions
        const feedbackToCreate = feedbackSuggestions[0][1];

        // get a comment with that classification to recommend resources and tasks
        const newCoworkerId =
          orderedFeedback[userId].feedbackSummary.negative[feedbackToCreate][0];

        const feedbackComment =
          orderedFeedback[userId].coworkersFeedback[newCoworkerId]
            .openFeedback[0][1];

        // get the resources with the highest similarity to the feedback
        const resources = await cosine_similarity(feedbackComment);

        // create tasks with the feedback received
        const tasks = await create_tasks(feedbackComment);

        // insert the selected resources for the user
        for (let task of tasks) {
          const [title, description] = task.split(":");
          await db.insert(pipTask).values({
            userId: userId,
            title: title,
            description: description,
            isDone: false,
          });
        }

        // insert the tasks for the user
        for (let resource of resources) {
          await db.insert(userResource).values({
            userId: userId,
            resourceId: resource,
          });
        }
      }

      // mark the sprint survey as processed
      await db
        .update(sprintSurvey)
        .set({ processed: true })
        .where(eq(sprintSurvey.id, sprintSurveyId));
    }
  }
}
