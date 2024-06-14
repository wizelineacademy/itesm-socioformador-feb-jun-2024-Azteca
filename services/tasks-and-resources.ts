"use server";
import {
  pipTask,
  sprintSurvey,
  SelectSprintSurvey,
  SelectPipTask,
  userResource,
  pipResource,
  SelectPipResource,
  rulerSurveyAnswers,
  finalSurvey,
  SelectFinalSurvey,
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

  if (!res[0]) return "No sprint survey was found";
  return res[0];
}

export async function getUserTasksForCurrentSprintByProjectId(
  projectId: number,
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return "You must be signed in";

  const currentSprintSurvey = await getCurrentSprintSurvey(projectId);
  if (typeof currentSprintSurvey === "string") {
    return currentSprintSurvey;
  }
  // check if the sprint is not processed to throw an error
  // check if there's no sprint survey results throw an error
  // check if all the surveys were answered, so the only one left is the project one

  if (!currentSprintSurvey.processed) {
    return "Curreny sprint survey was found, but it is not processed yet";
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
    return "No tasks available. Ask your manager for an update.";
  }

  return tasks;
}

export async function getUserTasksHistory(projectId: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return "You must be signed in";

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

  const finalSurveys = await db
    .select({ finalSurvey: finalSurvey, task: pipTask })
    .from(finalSurvey)
    .innerJoin(pipTask, eq(finalSurvey.id, pipTask.finalSurveyId))
    .where(
      and(
        // final surveys that belong to that project
        eq(finalSurvey.projectId, projectId),
        // tasks that belong to that user
        eq(pipTask.userId, userId),
        // final surveys  that have been already scheduled (i.e. the surveys have already been launched)
        lte(finalSurvey.scheduledAt, new Date()),
      ),
    );

  interface SelectFinalSurveyWithTasks extends SelectFinalSurvey {
    tasks: SelectPipTask[];
  }

  const finalSurveysWithTasks = finalSurveys.reduce((acc, row) => {
    const { finalSurvey, task } = row;
    let survey = acc.find((s) => s.id === finalSurvey.id);

    if (!survey) {
      survey = { ...finalSurvey, tasks: [] };
      acc.push(survey);
    }

    survey.tasks.push(task);

    return acc;
  }, [] as SelectFinalSurveyWithTasks[]);

  interface SurveysWithTasks {
    id: number;
    type: "SPRINT" | "FINAL";
    processed: boolean | null;
    scheduledAt: Date | null;
    tasks: SelectPipTask[];
  }
  const surveys = [] as SurveysWithTasks[];

  for (const sprintSurveyWithTasks of sprintSurveysWithTasks) {
    surveys.push({
      id: sprintSurveyWithTasks.id,
      type: "SPRINT",
      processed: sprintSurveyWithTasks.processed,
      scheduledAt: sprintSurveyWithTasks.scheduledAt,
      tasks: sprintSurveyWithTasks.tasks,
    });
  }

  for (const finalSurveyWithTasks of finalSurveysWithTasks) {
    surveys.push({
      id: finalSurveyWithTasks.id,
      type: "FINAL",
      processed: finalSurveyWithTasks.processed,
      scheduledAt: finalSurveyWithTasks.scheduledAt,
      tasks: finalSurveyWithTasks.tasks,
    });
  }

  if (surveys.length === 0) {
    return "No task history available";
  }

  return surveys;
}

export async function getUserResourcesForCurrentSprint(projectId: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return "You must be signed in";

  const currentSprintSurvey = await getCurrentSprintSurvey(projectId);
  if (typeof currentSprintSurvey === "string") {
    return currentSprintSurvey;
  }

  // check if the sprint is not processed to throw an error
  // check if there's no sprint survey results throw an error
  // check if all the surveys were answered, so the only one left is the project one

  if (!currentSprintSurvey.processed) {
    return "Curreny sprint survey was found, but it is not processed yet";
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
    return "No resources available. Ask your manager for an update.";
  }

  return resources;
}

export async function getUserResourcesHistory(projectId: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return "You must be signed in";

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

  const finalSurveys = await db
    .select({
      resource: pipResource,
      finalSurvey: finalSurvey,
    })
    .from(finalSurvey)
    .innerJoin(userResource, eq(finalSurvey.id, userResource.finalSurveyId))
    .innerJoin(pipResource, eq(userResource.resourceId, pipResource.id))
    .where(
      and(
        // final surveys that belong to that project
        eq(finalSurvey.projectId, projectId),
        // final surveys that have been already scheduled (i.e. the surveys have already been launched)
        lte(finalSurvey.scheduledAt, new Date()),
        // resources that belong to the user
        eq(userResource.userId, userId),
      ),
    )
    .orderBy(desc(finalSurvey.scheduledAt), asc(pipResource.title));

  interface SelectFinalSurveyWithResources extends SelectFinalSurvey {
    resources: SelectPipResource[];
  }

  const finalSurveysWithResources = finalSurveys.reduce((acc, row) => {
    const { finalSurvey, resource } = row;
    let survey = acc.find((s) => s.id === finalSurvey.id);

    if (!survey) {
      survey = { ...finalSurvey, resources: [] };
      acc.push(survey);
    }

    survey.resources.push(resource);

    return acc;
  }, [] as SelectFinalSurveyWithResources[]);

  // TODO: inform the frontend when the survey is pending for processing

  interface SurveysWithResources {
    id: number;
    type: "SPRINT" | "FINAL";
    processed: boolean | null;
    scheduledAt: Date | null;
    resources: SelectPipResource[];
  }
  const surveys = [] as SurveysWithResources[];

  for (const sprintSurveyWithResources of sprintSurveysWithResources) {
    surveys.push({
      id: sprintSurveyWithResources.id,
      type: "SPRINT",
      processed: sprintSurveyWithResources.processed,
      scheduledAt: sprintSurveyWithResources.scheduledAt,
      resources: sprintSurveyWithResources.resources,
    });
  }

  for (const finalSurveyWithResources of finalSurveysWithResources) {
    surveys.push({
      id: finalSurveyWithResources.id,
      type: "FINAL",
      processed: finalSurveyWithResources.processed,
      scheduledAt: finalSurveyWithResources.scheduledAt,
      resources: finalSurveyWithResources.resources,
    });
  }

  if (surveys.length === 0) {
    return "No task history available";
  }

  return surveys;
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
}

export async function rulerResources() {
  const session = await auth();
  const userId = session?.user?.id as string;
  const resources = db
    .select({
      id: userResource.resourceId,
      description: pipResource.description,
      embedding: pipResource.embedding,
      title: pipResource.title,
      kind: pipResource.kind,
      date: rulerSurveyAnswers.answeredAt,
    })
    .from(userResource)
    .leftJoin(pipResource, eq(userResource.resourceId, pipResource.id))
    .leftJoin(
      rulerSurveyAnswers,
      eq(rulerSurveyAnswers.id, userResource.rulerSurveyId),
    )
    .where(
      and(
        eq(userResource.userId, userId),
        isNotNull(userResource.rulerSurveyId),
      ),
    )
    .orderBy(desc(rulerSurveyAnswers.answeredAt));
  return resources;
}

export async function rulerTask() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const tasks = db
    .select({
      id: pipTask.id,
      userId: pipTask.userId,
      description: pipTask.description,
      rulerSurveyId: pipTask.rulerSurveyId,
      sprintSurveyId: pipTask.sprintSurveyId,
      finalSurveyId: pipTask.finalSurveyId,
      title: pipTask.title,
      status: pipTask.status,
      date: rulerSurveyAnswers.answeredAt,
    })
    .from(pipTask)
    .leftJoin(
      rulerSurveyAnswers,
      eq(rulerSurveyAnswers.id, pipTask.rulerSurveyId),
    )
    .where(and(eq(pipTask.userId, userId), isNotNull(pipTask.rulerSurveyId)))
    .orderBy(desc(rulerSurveyAnswers.answeredAt));

  return tasks;
}
