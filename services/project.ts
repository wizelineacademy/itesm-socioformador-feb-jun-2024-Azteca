"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import {
  finalSurvey,
  project,
  projectMember,
  sprintSurvey,
  user,
} from "@/db/schema";
import { and, eq, ne, or } from "drizzle-orm";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Resource } from "sst";
import { SQSMessageBody } from "@/types/types";

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

  jumpToNextSprint();
  while (currentDate <= newProject.endDate) {
    await db
      .insert(sprintSurvey)
      .values({ projectId, scheduledAt: currentDate });

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
  return await db
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
}

export async function updateFeedback(projectId: number) {
  console.log(projectId);

  const client = new SQSClient();

  for (let i = 0; i < 20; i++) {
    console.log("SCHEDULED EVENT NO", i);

    const messageBody = {
      projectId: i,
      content: "Hello from the subscriber",
    } as SQSMessageBody;

    await client.send(
      new SendMessageCommand({
        QueueUrl: Resource.FeedbackFlowQueue.url,
        MessageBody: JSON.stringify(messageBody),
      }),
    );
  }
}
