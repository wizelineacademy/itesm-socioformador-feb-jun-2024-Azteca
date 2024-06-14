"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import {
  finalSurvey,
  project,
  projectMember,
  sprintSurvey,
  user,
  sprintSurveyAnswerProject,
  rulerSurveyAnswers,
  rulerEmotion,
  sprintSurveyQuestion,
} from "@/db/schema";
import { and, asc, eq, inArray, ne, or } from "drizzle-orm";
import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { Resource } from "sst";

export async function getProjects() {
  // get all of the projects in which the user is either a member or a manager
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const projects = await db
    .selectDistinctOn([project.id], {
      id: project.id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
    })
    .from(project)
    .innerJoin(projectMember, eq(project.id, projectMember.projectId))
    .where(
      or(
        eq(project.managerId, userId), // get all projects where I'm manager
        eq(projectMember.userId, userId), // get all projects where I'm a member
      ),
    );

  return projects;
}

export async function getProjectById(projectId: number) {
  // get the project by id
  const res = await db
    .select({
      id: project.id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      sprintSurveyPeriodicityInDays: project.sprintSurveyPeriodicityInDays,
    })
    .from(project)
    .where(eq(project.id, projectId));

  return res[0];
}

type NewProject = Omit<typeof project.$inferInsert, "managerId">;

export async function createProject({
  newProject,
  members,
}: {
  newProject: NewProject;
  members: string[];
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  // Create the project and get the id
  const res = await db
    .insert(project)
    .values({ ...newProject, managerId: userId }) // Manager is current user
    .returning({ id: project.id });
  const { id: projectId } = res[0];

  console.log("MEMBERS", members);
  // Link the members to that project
  await db.insert(projectMember).values(
    members.map((member) => ({
      userId: member,
      projectId,
    })),
  );

  // Create the records for the sprint surveys
  const currentDate = new Date(newProject.startDate);

  const jumpToNextSprint = () => {
    currentDate.setDate(
      currentDate.getDate() + newProject.sprintSurveyPeriodicityInDays,
    );
  };

  const sprintSurveyQuestionsIds: number[] = [30, 31, 32, 33, 34, 41];

  jumpToNextSprint();
  while (currentDate <= newProject.endDate) {
    const [insertedSurvey] = await db
      .insert(sprintSurvey)
      .values({ projectId, scheduledAt: currentDate })
      .returning({ id: sprintSurvey.id });

    // insertedSurvey.id

    await db.insert(sprintSurveyQuestion).values(
      sprintSurveyQuestionsIds.map((questionId) => ({
        sprintSurveyId: insertedSurvey.id,
        questionId: questionId,
      })),
    );

    jumpToNextSprint();
  }

  // Create the records for the final survey
  await db
    .insert(finalSurvey)
    .values({ projectId, scheduledAt: newProject.endDate });
}

export async function deleteProjectById(projectId: number) {
  await db.delete(project).where(eq(project.id, projectId));
}

export async function getEmployeesInProjectById(projectId: number) {
  // get all of the projects in which the user is either a member or a manager
  const res = await db
    .selectDistinct({
      id: user.id,
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle,
      department: user.department,
      photoUrl: user.photoUrl,
    })
    .from(projectMember)
    .innerJoin(user, eq(projectMember.userId, user.id))
    .where(eq(projectMember.projectId, projectId));

  return res;
}

// This function returns the coworkers in a project that are also in a sprint survey
export async function getCoworkersInProject(sprintSurveyId: number) {
  const session = await auth();
  const currentUserId = session?.user?.id;
  if (!currentUserId) throw new Error("You must be signed in");
  const coworkers = db
    .select({
      userId: user.id,
      name: user.name,
      photoUrl: user.photoUrl,
    })
    .from(sprintSurvey)
    .innerJoin(project, eq(sprintSurvey.projectId, project.id)) // Join sprintSurvey to project
    .innerJoin(projectMember, eq(project.id, projectMember.projectId)) // Join project to projectMember
    .innerJoin(user, eq(projectMember.userId, user.id)) // Join projectMember to user
    .where(
      and(
        eq(sprintSurvey.id, sprintSurveyId), // Filter by sprintSurveyId
        ne(user.id, currentUserId), // Exclude the current user from the results
      ),
    );

  return coworkers;
}

export type SurveyStatus =
  | "COMPLETED"
  | "PENDING"
  | "PROCESSING"
  | "NOT_AVAILABLE";

export interface Survey {
  id: number;
  type: "SPRINT" | "FINAL";
  scheduledAt: Date;
  status: SurveyStatus;
}

export async function getUpdateFeedbackHistory({
  projectId,
}: {
  projectId: number;
}) {
  const getStatus = (
    scheduledAt: Date,
    processed: boolean,
    isProcessing: boolean,
  ): SurveyStatus => {
    const today = new Date();
    if (scheduledAt <= today) {
      // meaning it was already sent to users
      if (processed) {
        return "COMPLETED";
      } else {
        if (isProcessing) {
          return "PROCESSING";
        }
        return "PENDING";
      }
    }
    return "NOT_AVAILABLE";
  };

  const surveys: Survey[] = [];

  const sprintSurveys = await db
    .select()
    .from(sprintSurvey)
    .where(eq(sprintSurvey.projectId, projectId))
    .orderBy(asc(sprintSurvey.scheduledAt));

  sprintSurveys.forEach((s) => {
    surveys.push({
      id: s.id,
      type: "SPRINT",
      // TODO: make these types from drizzle schema to be non-null
      scheduledAt: s.scheduledAt as Date,
      status: getStatus(
        s.scheduledAt as Date,
        s.processed as boolean,
        s.isProcessing,
      ),
    });
  });

  const finalSurveys = await db
    .select()
    .from(finalSurvey)
    .where(eq(finalSurvey.projectId, projectId))
    .orderBy(asc(finalSurvey.scheduledAt));

  finalSurveys.forEach((s) => {
    surveys.push({
      id: s.id,
      type: "FINAL",
      // TODO: make these types from drizzle schema to be non-null
      scheduledAt: s.scheduledAt as Date,
      status: getStatus(
        s.scheduledAt as Date,
        s.processed as boolean,
        s.isProcessing,
      ),
    });
  });

  if (surveys.length === 0) {
    throw new Error("No feedback history available");
  }

  return surveys;
}

export interface SQSMessageBody {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
  type: "RULER" | "SPRINT" | "FINAL";
}

export async function updateFeedback(projectId: number) {
  const client = new SQSClient();
  const messageGroupId = crypto.randomUUID(); // we want all of these to be part of the same message group

  const feedbackHistory = await getUpdateFeedbackHistory({ projectId });

  // Get pending sprint surveys ids
  const sprintSurveyIds = feedbackHistory
    .filter((s) => s.status === "PENDING" && s.type === "SPRINT")
    .map((s) => s.id);

  // If there are pending sprint surveys
  if (sprintSurveyIds.length > 0) {
    // Put sprint surveys in processing state
    await db
      .update(sprintSurvey)
      .set({
        isProcessing: true,
      })
      .where(inArray(sprintSurvey.id, sprintSurveyIds));

    // Send sprint survey ids to the queue
    const response = await client.send(
      new SendMessageBatchCommand({
        QueueUrl: Resource.FeedbackFlowQueueV3.url,
        Entries: sprintSurveyIds.map((sprintSurveyId) => ({
          Id: crypto.randomUUID(),
          MessageGroupId: messageGroupId,
          MessageDeduplicationId: crypto.randomUUID(),
          MessageBody: JSON.stringify({
            id: sprintSurveyId,
            type: "SPRINT",
          } as SQSMessageBody),
        })),
      }),
    );
    console.log("response sprint surveys", response);
  }

  // Get pending final surveys ids
  const finalSurveyIds = feedbackHistory
    .filter((s) => s.status === "PENDING" && s.type === "FINAL")
    .map((s) => s.id);

  // If there are pending final surveys
  if (finalSurveyIds.length > 0) {
    // Put final surveys in processing state
    await db
      .update(finalSurvey)
      .set({
        isProcessing: true,
      })
      .where(inArray(finalSurvey.id, finalSurveyIds));

    // Send final survey ids to the queue
    const response1 = await client.send(
      new SendMessageBatchCommand({
        QueueUrl: Resource.FeedbackFlowQueueV3.url,
        Entries: finalSurveyIds.map((finalSurveyId) => ({
          Id: crypto.randomUUID(),
          MessageGroupId: messageGroupId,
          MessageDeduplicationId: crypto.randomUUID(),
          MessageBody: JSON.stringify({
            id: finalSurveyId,
            type: "FINAL",
          } as SQSMessageBody),
        })),
      }),
    );
    console.log("response final surveys", response1);
  }
}
async function getSprintSurveyAnswers(projectId: number) {
  return db
    .select({
      answer: sprintSurveyAnswerProject.answer,
    })
    .from(sprintSurveyAnswerProject)
    .innerJoin(
      sprintSurvey,
      eq(sprintSurveyAnswerProject.sprintSurveyId, sprintSurvey.id),
    )
    .where(
      and(
        eq(sprintSurvey.projectId, projectId),
        inArray(sprintSurveyAnswerProject.questionId, [26, 27, 28, 29]),
      ),
    );
}

// Obtener los userIds de los miembros del proyecto
async function getProjectMemberIds(projectId: number) {
  const projectMembers = await db
    .select({
      userId: projectMember.userId,
    })
    .from(projectMember)
    .where(eq(projectMember.projectId, projectId));

  return projectMembers.map((member) => member.userId);
}

// Obtener respuestas de las encuestas RULER
async function getRulerSurveyAnswers(userIds: string[]) {
  return db
    .select({
      pleasantness: rulerEmotion.pleasantness,
      energy: rulerEmotion.energy,
    })
    .from(rulerSurveyAnswers)
    .innerJoin(rulerEmotion, eq(rulerSurveyAnswers.emotionId, rulerEmotion.id))
    .where(inArray(rulerSurveyAnswers.userId, userIds));
}

export async function calculateEmployeeOverload(projectId: number) {
  const sprintAnswers = await getSprintSurveyAnswers(projectId);
  const userIds = await getProjectMemberIds(projectId);
  const rulerAnswers = await getRulerSurveyAnswers(userIds as string[]);

  const calculateAverage = (values: number[]) => {
    const total = values.reduce((acc, value) => acc + value, 0);
    return total / values.length;
  };

  const sprintScores = sprintAnswers.map((answer) => answer.answer);
  const avgSprintScore = calculateAverage(sprintScores as number[]);

  const emotionScores = rulerAnswers.map(
    (answer) => (answer.pleasantness as number) + (answer.energy as number),
  );
  const avgEmotionScore = calculateAverage(emotionScores);

  const employeeOverload = (avgSprintScore + avgEmotionScore) / 2;
  const normalizedOverload = Math.round(((employeeOverload + 6) / 12) * 100);

  return normalizedOverload || 0;
}
