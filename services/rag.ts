"use server";
import OpenAI from "openai";
import db from "@/db/drizzle";
import { and, count, desc, eq, inArray, isNull } from "drizzle-orm";
import { auth } from "@/auth";
import similarity from "compute-cosine-similarity";

import {
  pipTask,
  pipResource,
  pipResourceSkill,
  project,
  projectMember,
  question,
  questionSkill,
  rulerEmotion,
  rulerSurveyAnswers,
  skill,
  sprintSurvey,
  sprintSurveyAnswerCoworkers,
  sprintSurveyQuestion,
  userResource,
} from "@/db/schema";

// =============== FEEDBACK INTERFACES ===============

interface FeedbackCategory {
  [coworkerId: string]: {
    openFeedback: string;
    closedFeedback: Array<[number, number]>;
  };
}

interface FeedbackClassifications {
  positive: { [sentimentId: number]: string[] };
  negative: { [sentimentId: number]: string[] };
  biased: { [sentimentId: string]: string[] };
}

interface FeedbackRecords {
  [userId: string]: {
    coworkersFeedback: FeedbackCategory;
    feedbackClassifications: FeedbackClassifications;
  };
}

// =============== OTHER INTERFACES ===============

interface QuestionSkills {
  [questionId: number]: number[]; // array of skills of the question
}

interface EmbeddingRecord {
  id: number;
  embedding: GLfloat[] | null;
}

async function cosineSimilarity(
  baseMessage: string,
  embeddingRecords: EmbeddingRecord[],
): Promise<number[]> {
  const recordsSimilarity: [GLfloat, number][] = [];

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: baseMessage,
    encoding_format: "float",
  });

  const baseEmbedding = response.data[0].embedding;

  // calculate the cosine similarity between the base string and all the records
  for (const record of embeddingRecords) {
    const recordSimilarity: GLfloat = similarity(
      baseEmbedding,
      record.embedding as GLfloat[],
    ) as GLfloat;
    recordsSimilarity.push([recordSimilarity, record.id]);
  }

  // sort the elements by descending similarity, return only the IDs of the records
  const recordsId: number[] = recordsSimilarity
    .sort((a, b) => b[0] - a[0])
    .map((resource) => resource[1] as number)
    .filter((value): value is number => value !== null);

  return recordsId;
}

async function createTasks(weaknessMessage: string): Promise<string[]> {
  let cleanedTasks: string[] = [];

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const tasksInstructions: string = `El siguiente query representa ya sea lo que está pasando un usuario o sus áreas donde debe mejorar, debes crear tareas simples para la persona evaluada para mejorar su rendimiento o bienestar. Las tareas deben ser claras y concisas, deben estar relacionadas al query recibido, deben ser tareas simples que no tomen mucho tiempo al usuario pero que le permiten mejorar en su rendimiento o bienestar. Algunos ejemplos de tareas pueden ser "Hacer ejercicio", "Ir con el psicólogo", "Meditar", "Dormir 8 horas diarias", "Comer frutas y verduras", "Visitar a mi familia", etc., pero cuida que sean relacionadas al query ingresado, que sean sencilas y que todas sean diferentes.

  Hay otras indicaciones muy importantes que debes seguir por cada tarea:
  1. Cada tarea debe llevar un título y una descripción.
  2. El título no debe superar los 64 caracteres y la descripción no debe superar los 256 caracteres.
  3. Al crear ya sea el título o la descripción de cada tarea no debes usar nunca los caracteres "\n" ni ":" porque esos son caracteres especiales que yo te indicaré donde usar.
  4. Vas a juntar el título de cada tarea con la descripción donde el separador de en medio es el caracter ":" sin espacios en blanco entre todos los caracteres, solo en el mensaje del título y de la descripción.
  5. Vas a unir las estructuras de todas las tareas con el caracter "\n" como separador sin espacios en blanco entre la estructura de cada tarea y ese separador.
  6. El query puede o no llegar a tener más de 10 áreas de oportunidad, si ese es el caso debes crear tareas que involucren 2 o más áreas de oportunidad en una misma, puedes tomarte la libertad de crear la cantidad de tareas que consideres pero que nunca exceda la cantidad de 10 tareas. Si son menos de 10 áreas de oportunidad crea una tarea por cada área de oportunidad. Si el query es más relacionado al bienestar el usuario y no a su rendimiento laboral, las tareas deben estar relacionadas a mejorar su bienestar emocional, físico o mental y deben ser máximo 5.
  7. Aunque el contenido del query sea en inglés la generación de las tareas que vas a generar debe estar en español.
  8. La siguiente estructura es ilustrativa de cómo debes regresar el resultado con todas las tareas, fíjate en estructura no tanto en el contenido:
  """
  titulo_1:descripcion_1\ntitulo_2:descripcion_2\ntitulo_3:descripcion_3
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
        content: weaknessMessage,
      },
    ],
  });

  // clean the results of the generated tasks
  const tasks = (rawTasks.choices[0].message.content as string).split("\n");
  cleanedTasks = tasks.filter((element) => element !== "");

  return cleanedTasks;
}

async function reduceTask(message: string, maxLength: number): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const intructions: string =
    "El siguiente es un mensaje largo, debes reducir su longitud para que no exceda " +
    maxLength +
    " caracteres, pero sin que el mensaje pierda su significado ni su escencia.";

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: ``,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return response.choices[0].message.content as string;
}

async function processOpenFeedback(
  userFeedback: {
    coworkersFeedback: FeedbackCategory;
    feedbackClassifications: FeedbackClassifications;
  },
  uniqueResources: Set<number>,
  strengthsIds: Set<number>,
  weaknessesIds: Set<number>,
): Promise<[Set<number>, Set<number>, Set<number>]> {
  // join all the comments in a string of paragraphs
  const feedbackComments: string[] = Object.keys(userFeedback.coworkersFeedback)
    .map(
      (coworkerId) => userFeedback.coworkersFeedback[coworkerId].openFeedback,
    )
    .filter((element) => element !== "");

  // if there are no comments, return the same variables without any update
  if (feedbackComments.length > 0) {
    let joinedFeedbackComments: string = feedbackComments.join("\n\n");

    // string cleaning
    joinedFeedbackComments = joinedFeedbackComments.replaceAll("positive:", "");
    joinedFeedbackComments = joinedFeedbackComments.replaceAll("positivo:", "");
    joinedFeedbackComments = joinedFeedbackComments.replaceAll("negative:", "");
    joinedFeedbackComments = joinedFeedbackComments.replaceAll("negativo:", "");
    joinedFeedbackComments = joinedFeedbackComments.replaceAll("biased:", "");
    joinedFeedbackComments = joinedFeedbackComments.replaceAll("sesgado:", "");
    joinedFeedbackComments = joinedFeedbackComments.replaceAll("  ", " ");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });

    const classificationInstructions: string = `El siguiente query contiene varias retroalimentaciones hacia una persona. Realiza las siguientes instrucciones:
    1. Identifica las ideas claves de todo el texto, sepáralo por cada idea tomando en cuenta la coherencia entre las oraciones y las ideas que expresan guardando la conexión del asunto, puedes ignorar signos de puntuación si una misma oración une ideas diferentes, pero tu prioridad es separar las oraciones con ideas atómicas.
    2. De las oraciones agrupadas por ideas, sepáralas en las siguientes 3 clasificaciones de sentimientos, tomando en cuenta la descripción de cada una:
      * positive: cualquier cumplido, elogio o felicitación a la persona que recibe el comentario o a su desempeño en el trabajo. Las críticas constructivas si bien son una forma saludable de dar retroalimentación no cuentan como comentario positivo porque destacan una necesidad de mejora de la persona evaluada.
      * negative: cualquier comentario relacionado con críticas constructivas o áreas de mejora en las habilidades de la persona y en su desempeño laboral. Si hay un comentario relacionado con la inteligencia emocional o una crítica a al carácter de la persona sé muy cauteloso y presta atención si el comentario es objetivo y si habla con hechos, ya que es posible que pueda involucrar un ataque personal, tómalo como un comentario constructivo si brinda hechos e información de forma objetiva.
      * biased: cualquier comentario o crítica relacionada con la raza, color de piel, creencias, sexo, preferencias sexuales de la persona evaluada o comentarios con insultos y ataques personales. No es lo mismo que un comentario negativo porque no es imparcial.
    3. En cada una de las 3 clasificaciones de sentimiento une todas las oraciones en un párrafo sin importar si antes las oraciones se encontraban en otros párrafos, en ese caso debes separar las ideas con signos de puntuación pero deben encontrarse en el mismo párrafo si todas las oraciones tienen el mismo sentimiento en común de los 3 especificados, si encuentras varias oraciones diferentes que encuentren lo mismo omite todas las redundancias, conserva solo ideas únicas. Al unir las oraciones de cada clasificación debe haber una conexión clara entre las ideas, pero es posible que en la unión no haya coherencia gramatical o por signos de puntuación, si ese es el caso puedes modificar ligeramente las palabras o signos para unir todas las oraciones en un párrafo de la clasificación en cuestión, pero no alteres el contenido del mensaje que expresan.
    4. Separa las 3 clasificaciones con el separador "\n\n" que solo puede aparecer entre la clasificación de cada sentimiento, no en el párrafo formado de oraciones de cada clasificación.
    5. Si hay clasificaciones de sentimientos que no cuentan con ninguna oración porque ninguna cayó en esa categoría, aun así incluye el nombre del sentimiento con el separador definido en el paso anterior.
    6. Es importante que en tu respuesta el orden de las clasificaciones de sentimientos sea el mismo en que los presenté en el paso 2.
    7. No respondas ni expliques tu procedimiento, limítate a cumplir con las instrucciones especificadas con la estructura especificada, haz el análisis de todo el contenido del texto sin dejar oraciones sin procesar.
    
    Este es un ejemplo del resultado esperado, la categoría 'biased' se encuentra vacía porque ningún comentario encajó en las instrucciones proporcionadas de ese sentimiento y así se deben representar las categorías cuando ningún comentario pertenezca a ella, recuerda que es solo un ejemplo, pon atención en la estructura, no tanto en el contenido:
    """
    positive: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    \n\n
    negative: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
    \n\n
    biased:
    """`;

    // classify the feedback into 3 categories: positive, negative, biased
    const classifiedFeedback = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: classificationInstructions,
        },
        {
          role: "user",
          content: joinedFeedbackComments,
        },
      ],
    });

    // clean the results of the classification
    const sentiments = (
      classifiedFeedback.choices[0].message.content as string
    ).split("\n\n");
    const cleanedSentiments = sentiments.filter((element) => element !== "");

    const commentClassifications = {
      positive: "",
      negative: "",
      biased: "",
    };

    for (const sentiment of cleanedSentiments) {
      if (sentiment.includes("positive:")) {
        commentClassifications.positive = sentiment.substring(10);
      } else if (sentiment.includes("negative:")) {
        commentClassifications.negative = sentiment.substring(10);
      } else if (sentiment.includes("biased:")) {
        commentClassifications.biased = sentiment.substring(8);
      }
    }

    console.log("Positive comments: ", commentClassifications.positive);
    console.log("Negative comments: ", commentClassifications.negative);
    console.log("Biased comments: ", commentClassifications.biased);

    // ==================== RAG AND WEAKNESSES ANALYSIS ====================

    // add the recommended resources of the user
    if (commentClassifications.negative !== "") {
      const allResources: EmbeddingRecord[] = await db
        .select({ id: pipResource.id, embedding: pipResource.embedding })
        .from(pipResource);
      const recommendedResourcesIds = await cosineSimilarity(
        commentClassifications.negative,
        allResources,
      );
      recommendedResourcesIds.splice(5);
      recommendedResourcesIds.map((element) => uniqueResources.add(element));

      // get the negative skills solved by the selected resources, set them as weaknesses of the user
      if (recommendedResourcesIds.length > 0) {
        const newResourcesNegativeSkills = await db
          .select({
            negativeSkillId: pipResourceSkill.skillId,
          })
          .from(pipResourceSkill)
          .where(inArray(pipResourceSkill.skillId, recommendedResourcesIds));

        newResourcesNegativeSkills.forEach((element) => {
          weaknessesIds.add(element.negativeSkillId as number);
        });
      }
    }

    // ==================== STRENGTHS ANALYSIS ====================

    // analize the biased feedback
  }

  return [uniqueResources, strengthsIds, weaknessesIds];
}

async function orderFeedback(
  sprintSurveyId: number,
  uniqueWorkers: string[],
): Promise<FeedbackRecords> {
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
    .innerJoin(
      question,
      eq(question.id, sprintSurveyAnswerCoworkers.questionId),
    )
    .where(
      and(
        eq(question.type, "COWORKER_COMMENT"),
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
    .innerJoin(
      question,
      eq(question.id, sprintSurveyAnswerCoworkers.questionId),
    )
    .where(
      and(
        eq(question.type, "COWORKER_QUESTION"),
        eq(sprintSurvey.id, sprintSurveyId),
      ),
    );

  // initialize the empty structure with the keys
  for (const userId of uniqueWorkers) {
    const filteredCoworkers = uniqueWorkers.filter(
      (element): element is string =>
        typeof element === "string" && element !== userId,
    );

    feedbackRecords[userId] = {
      coworkersFeedback: {},
      feedbackClassifications: {
        positive: {},
        negative: {},
        biased: {},
      },
    };

    for (const coworkerId of filteredCoworkers) {
      feedbackRecords[userId]["coworkersFeedback"][coworkerId] = {
        openFeedback: "",
        closedFeedback: [],
      };
    }
  }

  coworkersOpenFeedback.forEach((record) => {
    if (record.coworkerId !== null && record.coworkerId !== undefined) {
      feedbackRecords[record.userId as string]["coworkersFeedback"][
        record.coworkerId
      ].openFeedback = record.comment as string;
    }
  });

  coworkersClosedFeedback.forEach((record) => {
    if (record.coworkerId !== null && record.coworkerId !== undefined) {
      feedbackRecords[record.userId as string]["coworkersFeedback"][
        record.coworkerId
      ].closedFeedback.push([
        record.questionId as number,
        record.answer as number,
      ]);
    }
  });

  return feedbackRecords;
}

async function getFeedbackClassifications(
  coworkersFeedback: FeedbackCategory,
  questionsSkills: QuestionSkills,
): Promise<FeedbackClassifications> {
  const feedbackClassifications: FeedbackClassifications = {
    positive: {},
    negative: {},
    biased: {},
  };

  // read the feedback of each coworker and classify it
  for (const coworkerId of Object.keys(coworkersFeedback)) {
    const closedFeedback = coworkersFeedback[coworkerId].closedFeedback;
    // read all the closed feedback of the coworker
    for (const feedback of closedFeedback) {
      if (feedback[1] >= 8) {
        // add the positive skills of the question
        const questionPositiveSkills = questionsSkills[feedback[0]].map(
          (skillId) => skillId as number,
        );
        for (const positiveSkillId of questionPositiveSkills) {
          if (positiveSkillId in feedbackClassifications.positive) {
            // the skill already exists in the classification, check if the coworker is already there
            if (
              !feedbackClassifications.positive[positiveSkillId].includes(
                coworkerId,
              )
            ) {
              feedbackClassifications.positive[positiveSkillId].push(
                coworkerId,
              );
            }
          } else {
            // the skill does not exist in the classification, add the coworker
            feedbackClassifications.positive[positiveSkillId] = [coworkerId];
          }
        }
      } else {
        // add the negative skills of the question
        const questionNegativeSkills = questionsSkills[feedback[0]].map(
          (skillId) => skillId as number,
        );
        for (const negativeSkillId of questionNegativeSkills) {
          if (negativeSkillId in feedbackClassifications.negative) {
            // the skill already exists in the classification, check if the coworker is already there
            if (
              !feedbackClassifications.negative[negativeSkillId].includes(
                coworkerId,
              )
            ) {
              feedbackClassifications.negative[negativeSkillId].push(
                coworkerId,
              );
            }
          } else {
            // the skill does not exist in the classification, add the coworker
            feedbackClassifications.negative[negativeSkillId] = [coworkerId];
          }
        }
      }
    }
  }

  return feedbackClassifications;
}

async function getQuestionsSkills(
  sprintSurveyId: number,
): Promise<QuestionSkills> {
  const questionsSkills: QuestionSkills = {};
  const questions = await db
    .select({
      questionId: sprintSurveyQuestion.questionId,
    })
    .from(sprintSurveyQuestion)
    .innerJoin(question, eq(question.id, sprintSurveyQuestion.questionId))
    .where(
      and(
        eq(sprintSurveyQuestion.sprintSurveyId, sprintSurveyId),
        eq(question.type, "COWORKER_QUESTION"),
      ),
    );

  questions.forEach(async (question) => {
    const associatedSkills = await db
      .select({ skillId: questionSkill.skillId })
      .from(questionSkill)
      .where(eq(questionSkill.questionId, question.questionId as number));
    questionsSkills[question.questionId as number] = associatedSkills.map(
      (element) => element.skillId as number,
    );
  });

  return questionsSkills;
}

export async function rulerAnalysis(
  userId: string,
  userComment: string,
  emotionId: number,
  sprintSurveyId: number,
) {
  const emotionInfo = await db
    .select({
      name: rulerEmotion.name,
      description: rulerEmotion.description,
      embedding: rulerEmotion.embedding,
      pleasentess: rulerEmotion.pleasantness,
      energy: rulerEmotion.energy,
    })
    .from(rulerEmotion)
    .where(eq(rulerEmotion.id, emotionId));

  // recommend tasks and resources only if the emotion is negative
  const pleasentess = emotionInfo[0].pleasentess as number;
  if (pleasentess < 1) {
    const allResources = await db
      .select({ id: pipResource.id, embedding: pipResource.embedding })
      .from(pipResource);

    let baseMessage: string = "This is the mood of the user:\n";
    baseMessage += ((emotionInfo[0].name as string) +
      ": " +
      emotionInfo[0].description) as string;

    if (userComment !== "") {
      baseMessage += "\n\n" + "and this are his thoughts:\n" + userComment;
    }

    const recommendedResourcesIds: number[] = await cosineSimilarity(
      baseMessage,
      allResources,
    );

    const tasks: string[] = await createTasks(baseMessage);

    tasks.forEach(async (task) => {
      const [title, description] = task.split(":");
      await db.insert(pipTask).values({
        userId: userId,
        title: title,
        description: description,
        sprintSurveyId: sprintSurveyId,
      });
    });

    recommendedResourcesIds.forEach(async (resourceId) => {
      await db.insert(userResource).values({
        userId: userId,
        resourceId: resourceId,
        sprintSurveyId: sprintSurveyId,
      });
    });
  }
}

// Main function
export async function feedbackAnalysis(sprintSurveyId: number) {
  const processedSurvey = await db
    .select({ processed: sprintSurvey.processed })
    .from(sprintSurvey)
    .where(eq(sprintSurvey.id, sprintSurveyId));

  const notProcessedSurvey = !processedSurvey[0].processed;

  // analyze survey only if it has not been processed
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
    const orderedFeedback = await orderFeedback(sprintSurveyId, ids);
    const questionsSkills = await getQuestionsSkills(sprintSurveyId);

    // iterate through each unique user of the project and read the feedback received
    for (const userId of Object.keys(orderedFeedback)) {
      const userTasksCount = await db
        .select({ count: count() })
        .from(pipTask)
        .where(
          and(
            eq(pipTask.userId, userId),
            eq(pipTask.sprintSurveyId, sprintSurveyId),
          ),
        );

      const userResourcesCount = await db
        .select({ count: count() })
        .from(userResource)
        .where(
          and(
            eq(userResource.userId, userId),
            eq(userResource.sprintSurveyId, sprintSurveyId),
          ),
        );

      // safety double check if the user has been checked in case of a failure in the middle of a previous survey analysis
      if (userTasksCount[0].count == 0 || userResourcesCount[0].count == 0) {
        let uniqueResources: Set<number> = new Set<number>();
        orderedFeedback[userId].feedbackClassifications =
          await getFeedbackClassifications(
            orderedFeedback[userId].coworkersFeedback,
            questionsSkills,
          );

        // ================== CLOSED FEEDBACK SUMMARIZED ==================
        let strengthsIds: Set<number> = new Set();
        let weaknessesIds: Set<number> = new Set();
        const userNegativeSkills: [number, number][] = []; // [coworkersCount, negativeSkillId]

        // get the detected negative skills
        Object.keys(
          orderedFeedback[userId].feedbackClassifications.negative,
        ).forEach((negativeSkill) => {
          const negativeSkillId = Number(negativeSkill);
          userNegativeSkills.push([
            orderedFeedback[userId].feedbackClassifications.negative[
              negativeSkillId
            ].length,
            Number(negativeSkill),
          ]);
        });

        // sort the negative skills by the number of coworkers that suggested them in descending order
        const negativeSkillsIds = userNegativeSkills
          .sort((a, b) => b[0] - a[0])
          .map((element) => element[1]);

        // get the associated resources with the negative skills
        if (negativeSkillsIds.length > 0) {
          const closedFeedbackRecommendedResources = await db
            .select({
              resourceId: pipResourceSkill.pipResourceId,
            })
            .from(pipResourceSkill)
            .where(inArray(pipResourceSkill.skillId, negativeSkillsIds));

          const resourcesArrayIds = closedFeedbackRecommendedResources.map(
            (element) => element.resourceId,
          );

          // add the resources to the recommendations of the user
          resourcesArrayIds.forEach((resourceId) =>
            uniqueResources.add(resourceId as number),
          );

          weaknessesIds = new Set(negativeSkillsIds);
        }

        const positiveSkillsIds: number[] = [];

        Object.keys(
          orderedFeedback[userId].feedbackClassifications.positive,
        ).forEach((element) => {
          const positiveSkillId = Number(element);
          positiveSkillsIds.push(positiveSkillId);
        });

        strengthsIds = new Set(positiveSkillsIds);

        console.log(userId);
        console.log("Strengths", strengthsIds);
        console.log("Weaknesses", weaknessesIds);
        console.log("Resources ids", uniqueResources);
        console.log("\n");

        // ================== ANALYSIS OF COMMENTS ==================

        [uniqueResources, strengthsIds, weaknessesIds] =
          await processOpenFeedback(
            orderedFeedback[userId],
            uniqueResources,
            strengthsIds,
            weaknessesIds,
          );

        console.log("Strengths after comments analysis: ", strengthsIds);
        console.log("Weaknesses after comments analysis: ", weaknessesIds);
        console.log("Resources after comments analysis: ", uniqueResources);
        console.log("\n\n\n");
        // =========== STORE SELECTED TASKS AND RESOURCES ===========

        if (weaknessesIds.size > 0) {
          const tasks = await createTasks(weaknessesIds);
          for (let task of tasks) {
            const [title, description] = task.split(":");
            let newTitle = title;
            let newDescription = description;
            if (title.length > 64) {
              newTitle = await reduceTask(title, 64);
            }
            if (description.length > 256) {
              newDescription = await reduceTask(description, 256);
            }
            await db.insert(pipTask).values({
              userId: userId,
              title: newTitle,
              description: newDescription,
              sprintSurveyId: sprintSurveyId,
            });
          }
        }

        for (const resourceId of Array.from(uniqueResources)) {
          await db.insert(userResource).values({
            userId: userId,
            resourceId: resourceId,
            sprintSurveyId: sprintSurveyId,
          });
        }

        // set the strengths and weaknesses of the user
      }
    }

    await db
      .update(sprintSurvey)
      .set({ processed: true })
      .where(eq(sprintSurvey.id, sprintSurveyId));
  }
}
