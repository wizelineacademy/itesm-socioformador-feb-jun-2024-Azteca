"use server";

import {
  projectMember,
  user,
  userRoleEnum,
  project,
  skill,
  userSkill,
} from "@/db/schema";
import db from "@/db/drizzle";
import { eq, not, and, or, asc, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { auth } from "@/auth";
import bcrypt from "bcrypt";
import { DatabaseError } from "pg";

export async function getUserInfoById(id: string) {
  const res = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle,
      department: user.department,
      photoUrl: user.photoUrl,
      role: user.role,
      bannerId: user.bannerId,
      primaryColor: user.primaryColor,
      lightMode: user.lightMode,
    })
    .from(user)
    .where(eq(user.id, id));

  if (res.length === 0) {
    throw new Error("User could not be found");
  }
  return res[0];
}

export async function getUserInfo() {
  const session = await auth();
  const id = session?.user?.id as string;
  const res = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle,
      department: user.department,
      photoUrl: user.photoUrl,
      role: user.role,
      bannerId: user.bannerId,
      primaryColor: user.primaryColor,
      lightMode: user.lightMode,
    })
    .from(user)
    .where(eq(user.id, id));

  if (res.length === 0) {
    throw new Error("User could not be found");
  }
  return res[0];
}

export async function getUserId() {
  const session = await auth();
  return session?.user?.id as string;
}

export async function getUserByEmail(email: string) {
  const users = await db.select().from(user).where(eq(user.email, email));
  return users[0];
}

export const getUserRole = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const res = await db.select().from(user).where(eq(user.id, userId));
  const { role } = res[0];
  return role;
};

export const registerUser = async (
  name: string | undefined,
  email: string | undefined,
  password: string | undefined,
  department: string | undefined,
  jobTitle: string | undefined,
) => {
  if (!name || !email || !password || !department || !jobTitle) {
    throw new Error("Empty fields");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await db
    .insert(user)
    .values({
      name: name,
      email: email,
      password: hashedPassword,
      role: "EMPLOYEE",
      department: department,
      jobTitle: jobTitle,
      bannerId: "Banner1.svg",
      primaryColor: "#6640D5",
      lightMode: true,
    })
    .catch((e) => {
      const dbError = e as DatabaseError;
      if (dbError.code === "23505")
        throw new Error(`Email already registered ${dbError.code}`);
      else throw new Error(`Error registering the user ${dbError.code}`);
    });
};

export const getUsers = async () => {
  return await db.select().from(user).orderBy(asc(user.name));
};

export const getRoles = async () => {
  return userRoleEnum.enumValues.map((enumValue) => ({
    name: enumValue,
    value: enumValue,
  }));
};

export const updateRole = async ({
  id,
  newRole,
}: {
  id: string;
  newRole: typeof user.$inferInsert.role;
}) => {
  await db.update(user).set({ role: newRole }).where(eq(user.id, id)).execute();
};

export const updateBannerId = async ({ bannerId }: { bannerId: string }) => {
  const session = await auth();
  const id = session?.user?.id as string;

  await db
    .update(user)
    .set({ bannerId: bannerId })
    .where(eq(user.id, id))
    .execute();
};

export const updatePrimaryColor = async ({
  id,
  primaryColor,
}: {
  id: string;
  primaryColor: string;
}) => {
  await db
    .update(user)
    .set({ primaryColor: primaryColor })
    .where(eq(user.id, id))
    .execute();
};

export const updateLightMode = async ({
  id,
  lightMode,
}: {
  id: string;
  lightMode: boolean;
}) => {
  await db
    .update(user)
    .set({ lightMode: lightMode })
    .where(eq(user.id, id))
    .execute();
};

export async function getUserSkillsById(id: string) {
  const strengths = await db
    .select({
      name: skill.positiveSkill,
      description: skill.positiveDescription,
    })
    .from(skill)
    .leftJoin(userSkill, eq(userSkill.skillId, skill.id))
    .where(and(eq(userSkill.userId, id), eq(userSkill.kind, "STRENGTH")));

  const areasOfOportunity = await db
    .select({
      name: skill.negativeSkill,
      description: skill.negativeDescription,
    })
    .from(skill)
    .leftJoin(userSkill, eq(userSkill.skillId, skill.id))
    .where(
      and(eq(userSkill.userId, id), eq(userSkill.kind, "AREA_OF_OPPORTUNITY")),
    );

  const traits = {
    strengths: strengths,
    areasOfOportunity: areasOfOportunity,
  };
  return traits;
}

export async function getCoWorkers(userId: string | null | undefined) {
  if (!userId || userId === undefined) {
    const session = await auth();
    userId = session?.user?.id;
    if (!userId) {
      throw new Error("You most be signed in");
    }
  }
  const pm = alias(projectMember, "pm");
  const pm2 = alias(projectMember, "pm2");
  const res = await db
    .selectDistinct({
      id: user.id,
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle,
      department: user.department,
      photoUrl: user.photoUrl,
    })
    .from(pm)
    .innerJoin(pm2, eq(pm.projectId, pm2.projectId))
    .innerJoin(user, eq(user.id, pm2.userId))
    .where(eq(pm.userId, userId));

  const coworkers = res.filter((user) => user.id !== userId);
  return coworkers;
}

export async function getProjectsProfile(userId: string | null | undefined) {
  if (!userId || userId === undefined) {
    const session = await auth();
    userId = session?.user?.id;
    if (!userId) {
      throw new Error("You most be signed in");
    }
  }

  const res = await db
    .selectDistinctOn([project.id], {
      id: project.id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
    })
    .from(projectMember)
    .innerJoin(project, eq(projectMember.projectId, project.id))
    .where(or(eq(projectMember.userId, userId), eq(project.managerId, userId)));
  return res;
}

export async function getAllEmployees() {
  const res = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
    })
    .from(user)
    .where(not(eq(user.role, "ADMIN")));
  return res;
}
export async function searchUsers(query: string) {
  const res = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
    })
    .from(user)
    .where(sql`${user.name} ILIKE ${`%${query}%`}`)
    .orderBy(asc(user.name));

  return res;
}

export async function getUserManagedBy(userId: string, managerId: string) {
  const res = await db
    .select()
    .from(project)
    .innerJoin(projectMember, eq(project.id, projectMember.projectId))
    .where(
      and(eq(projectMember.userId, userId), eq(project.managerId, managerId)),
    );

  if (res.length >= 1) {
    // if there's at least one match, then return true
    return false;
  }

  // if no matches, return false
  return false;
}
