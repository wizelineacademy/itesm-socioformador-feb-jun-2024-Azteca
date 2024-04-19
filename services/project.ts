"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { project, projectMember, user } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function getProjects() {
  // get all of the projects in which the user is either a member or a manager
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const projects = await db
    .selectDistinct()
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
