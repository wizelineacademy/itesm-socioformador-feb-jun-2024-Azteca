"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { project, projectMember, user } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  const res = await db
    .insert(project)
    .values({ ...newProject, managerId: userId })
    .returning({ id: project.id });
  const { id: projectId } = res[0];

  await db.insert(projectMember).values(
    members.map((member) => ({
      userId: member,
      projectId,
    })),
  );

  revalidatePath("/projects");
  redirect("/projects");
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
