"use server";
import {
  pipTask,
  pipResource,
  userResource,
  sprintSurvey,
  SelectSprintSurvey,
  SelectPipTask,
} from "@/db/schema";
import db from "@/db/drizzle";
import { eq, lte, and, desc } from "drizzle-orm";
import { auth } from "@/auth";

export async function getUserTasksForCurrentSprintByProjectId(
  projectId: number,
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const res = await db
    .select()
    .from(sprintSurvey)
    .where(
      and(
        // sprint surveys that belong to that project
        eq(sprintSurvey.projectId, projectId),
        // sprint surveys of sprints that have been already scheduled (i.e. the surveys have already been launched)
        lte(sprintSurvey.scheduledAt, new Date()),
      ),
    )
    .orderBy(desc(sprintSurvey.scheduledAt))
    .limit(1);

  // check if the sprint is not processed to throw an error
  // check if there's no sprint survey results throw an error
  // check if all the surveys were answered, so the only one left is the project one

  if (!res[0]) {
    throw new Error("No sprint survey was found");
  }

  if (!res[0].processed) {
    throw new Error(
      "Curreny sprint survey was found, but it is not processed yet",
    );
  }

  const sprintSurveyId = res[0].id;

  const tasks = await db
    .select()
    .from(pipTask)
    .where(
      and(
        eq(pipTask.userId, userId),
        eq(pipTask.sprintSurveyId, sprintSurveyId),
      ),
    );

  if (tasks.length === 0) {
    throw new Error("No tasks available. Ask your manager for an update.");
  }

  console.log(tasks);

  return tasks;
}

export async function getUserTasksHistory(projectId: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const sprintSurveys = await db
    .select({ sprintSurvey: sprintSurvey, task: pipTask })
    .from(sprintSurvey)
    .innerJoin(pipTask, eq(sprintSurvey.id, pipTask.sprintSurveyId))
    .where(
      and(
        // sprint surveys that belong to that project
        eq(sprintSurvey.projectId, projectId),
        // sprint surveys of sprints that have been already scheduled (i.e. the surveys have already been launched)
        lte(sprintSurvey.scheduledAt, new Date()),
      ),
    );

  interface SelectSprintSurveyWithTasks extends SelectSprintSurvey {
    tasks: SelectPipTask[];
  }

  const sprintSurveysWithTasks = sprintSurveys.reduce((acc, row) => {
    const { sprintSurvey, task } = row;
    let survey = acc.find((s) => s.id === sprintSurvey.id);

    if (!survey) {
      survey = { ...sprintSurvey, tasks: [] };
      acc.push(survey);
    }

    survey.tasks.push(task);

    return acc;
  }, [] as SelectSprintSurveyWithTasks[]);

  // TODO: inform the frontend when the survey is pending for processing

  if (sprintSurveysWithTasks.length === 0) {
    throw new Error("No task history available");
  }

  return sprintSurveysWithTasks;
}

export async function getUserResourcesForCurrentSprint() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const res = await db
    .select({
      id: pipResource.id,
      userId: userResource.userId,
      title: pipResource.title,
      description: pipResource.description,
      kind: pipResource.kind,
    })
    .from(userResource)
    .innerJoin(pipResource, eq(userResource.resourceId, pipResource.id))
    .where(eq(userResource.userId, userId));

  return res;
}

export async function getUserResourcesHistory() {}

export async function updateTask({
  taskId,
  newStatus,
}: {
  taskId: number;
  newStatus: typeof pipTask.$inferSelect.status;
}) {
  await db
    .update(pipTask)
    .set({ status: newStatus })
    .where(eq(pipTask.id, taskId));

  console.log("pipTask", taskId, newStatus);
}
