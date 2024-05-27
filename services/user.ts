"use server";

import { projectMember, user, userRoleEnum, project } from "@/db/schema";
import db from "@/db/drizzle";
import * as schema from "@/db/schema";
import { eq, not, and, or, asc, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { auth } from "@/auth";
import bcrypt from "bcrypt";
import { DatabaseError } from "pg";

export async function getUserInfoById(id: string) {
  const res = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
      jobTitle: schema.user.jobTitle,
      department: schema.user.department,
      photoUrl: schema.user.photoUrl,
      role: schema.user.role,
      bannerId: schema.user.bannerId,
      primaryColor: schema.user.primaryColor,
      lightMode: schema.user.lightMode,
    })
    .from(schema.user)
    .where(eq(schema.user.id, id));

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
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
      jobTitle: schema.user.jobTitle,
      department: schema.user.department,
      photoUrl: schema.user.photoUrl,
      role: schema.user.role,
      bannerId: schema.user.bannerId,
      primaryColor: schema.user.primaryColor,
      lightMode: schema.user.lightMode,
    })
    .from(schema.user)
    .where(eq(schema.user.id, id));

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

export async function getUserTraitsById(id: string) {
  const res = await db
    .select({
      id: schema.trait.id,
      name: schema.trait.name,
      description: schema.trait.description,
      kind: schema.trait.kind,
    })
    .from(schema.trait)
    .innerJoin(schema.userTrait, eq(schema.userTrait.traitId, schema.trait.id))
    .innerJoin(schema.user, eq(schema.userTrait.userId, schema.user.id))
    .where(eq(schema.user.id, id));

  const strengths_arr = [];
  const areasOfOportunity_arr = [];

  for (let c = 0; c < res.length; c++) {
    if (res[c].kind == "AREA_OF_OPPORTUNITY") {
      areasOfOportunity_arr.push(res[c]);
    } else if (res[c].kind == "STRENGTH") {
      strengths_arr.push(res[c]);
    }
  }
  const traits = {
    strengths: strengths_arr,
    areasOfOportunity: areasOfOportunity_arr,
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
  const pm = alias(schema.projectMember, "pm");
  const pm2 = alias(schema.projectMember, "pm2");
  const res = await db
    .selectDistinct({
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
      jobTitle: schema.user.jobTitle,
      department: schema.user.department,
      photoUrl: schema.user.photoUrl,
    })
    .from(pm)
    .innerJoin(pm2, eq(pm.projectId, pm2.projectId))
    .innerJoin(schema.user, eq(schema.user.id, pm2.userId))
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
    .selectDistinctOn([schema.project.id], {
      id: schema.project.id,
      name: schema.project.name,
      description: schema.project.description,
      startDate: schema.project.startDate,
      endDate: schema.project.endDate,
    })
    .from(schema.projectMember)
    .innerJoin(
      schema.project,
      eq(schema.projectMember.projectId, schema.project.id),
    )
    .where(
      or(
        eq(schema.projectMember.userId, userId),
        eq(schema.project.managerId, userId),
      ),
    );
  return res;
}

export async function getAllEmployees() {
  const res = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
      photoUrl: schema.user.photoUrl,
    })
    .from(user)
    .where(not(eq(user.role, "ADMIN")));
  return res;
}
export async function searchUsers(query: string) {
  const res = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
      photoUrl: schema.user.photoUrl,
    })
    .from(schema.user)
    .where(sql`${schema.user.name} ILIKE ${`%${query}%`}`)
    .orderBy(asc(schema.user.name));

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
