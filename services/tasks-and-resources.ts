"use server";
import {
  pipTask,
  sprintSurvey,
  SelectSprintSurvey,
  SelectPipTask,
  userResource,
  pipResource,
  SelectPipResource,
} from "@/db/schema";
import db from "@/db/drizzle";
import { eq, lte, and, desc, asc, isNotNull } from "drizzle-orm";
import { auth } from "@/auth";

export async function getCurrentSprintSurvey(projectId: number) {
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

  if (!res[0]) throw new Error("No sprint survey was found");
  return res[0];
}

export async function getUserTasksForCurrentSprintByProjectId(
  projectId: number,
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const currentSprintSurvey = await getCurrentSprintSurvey(projectId);

  // check if the sprint is not processed to throw an error
  // check if there's no sprint survey results throw an error
  // check if all the surveys were answered, so the only one left is the project one

  if (!currentSprintSurvey.processed) {
    throw new Error(
      "Curreny sprint survey was found, but it is not processed yet",
    );
  }

  const tasks = await db
    .select()
    .from(pipTask)
    .where(
      and(
        eq(pipTask.userId, userId),
        eq(pipTask.sprintSurveyId, currentSprintSurvey.id),
      ),
    )
    .orderBy(asc(pipTask.title));

  if (tasks.length === 0) {
    throw new Error("No tasks available. Ask your manager for an update.");
  }

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
        // tasks that belong to that user
        eq(pipTask.userId, userId),
        // sprint surveys of sprints that have been already scheduled (i.e. the surveys have already been launched)
        lte(sprintSurvey.scheduledAt, new Date()),
      ),
    )
    .orderBy(desc(sprintSurvey.scheduledAt), asc(pipTask.title));

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

export async function getUserResourcesForCurrentSprint(projectId: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const currentSprintSurvey = await getCurrentSprintSurvey(projectId);

  // check if the sprint is not processed to throw an error
  // check if there's no sprint survey results throw an error
  // check if all the surveys were answered, so the only one left is the project one

  if (!currentSprintSurvey.processed) {
    throw new Error(
      "Curreny sprint survey was found, but it is not processed yet",
    );
  }

  const res = await db
    .select({
      resource: pipResource,
    })
    .from(userResource)
    .innerJoin(pipResource, eq(userResource.resourceId, pipResource.id))
    .where(
      and(
        eq(userResource.userId, userId),
        eq(userResource.sprintSurveyId, currentSprintSurvey.id),
      ),
    )
    .orderBy(asc(pipResource.title));

  const resources = res.map((e) => ({ ...e.resource }));

  if (resources.length === 0) {
    throw new Error("No resources available. Ask your manager for an update.");
  }

  return resources;
}

export async function getUserResourcesHistory(projectId: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const sprintSurveys = await db
    .select({
      resource: pipResource,
      sprintSurvey: sprintSurvey,
    })
    .from(sprintSurvey)
    .innerJoin(userResource, eq(sprintSurvey.id, userResource.sprintSurveyId))
    .innerJoin(pipResource, eq(userResource.resourceId, pipResource.id))
    .where(
      and(
        // sprint surveys that belong to that project
        eq(sprintSurvey.projectId, projectId),
        // sprint surveys of sprints that have been already scheduled (i.e. the surveys have already been launched)
        lte(sprintSurvey.scheduledAt, new Date()),
        // resources that belong to the user
        eq(userResource.userId, userId),
      ),
    )
    .orderBy(desc(sprintSurvey.scheduledAt), asc(pipResource.title));

  interface SelectSprintSurveyWithResources extends SelectSprintSurvey {
    resources: SelectPipResource[];
  }

  const sprintSurveysWithResources = sprintSurveys.reduce((acc, row) => {
    const { sprintSurvey, resource } = row;
    let survey = acc.find((s) => s.id === sprintSurvey.id);

    if (!survey) {
      survey = { ...sprintSurvey, resources: [] };
      acc.push(survey);
    }

    survey.resources.push(resource);

    return acc;
  }, [] as SelectSprintSurveyWithResources[]);

  // TODO: inform the frontend when the survey is pending for processing

  if (sprintSurveysWithResources.length === 0) {
    throw new Error("No resource history available");
  }

  return sprintSurveysWithResources;
}

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

export async function rulerResources() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const resources = db
    .select()
    .from(userResource)
    .leftJoin(pipResource, eq(userResource.resourceId, pipResource.id))
    .where(
      and(
        eq(userResource.userId, userId),
        isNotNull(userResource.rulerSurveyId),
      ),
    )
    .orderBy(userResource.rulerSurveyId);

  return resources;
}

export async function rulerTask() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const tasks = db
    .select()
    .from(pipTask)
    .where(and(eq(pipTask.userId, userId), isNotNull(pipTask.rulerSurveyId)))
    .orderBy(userResource.rulerSurveyId);

  return tasks;
}
