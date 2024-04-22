"use server";

import {
  projectMember,
  trait,
  user,
  userTrait,
  userRoleEnum,
} from "@/db/schema";
import db from "@/db/drizzle";
import * as schema from "@/db/schema";
import { eq, not, and, or, asc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { auth } from "@/auth";
import bcrypt from "bcrypt";

export async function getInfoById() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");
  const res = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
      jobTitle: schema.user.jobTitle,
      department: schema.user.department,
      photoUrl: schema.user.photoUrl,
      role: schema.user.role,
    })
    .from(schema.user)
    .where(eq(schema.user.id, userId));
  return res[0];
}

// TODO: this function is duplicated in the middleware
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
) => {
  try {
    if (!name || !email || !password) {
      throw new Error("Empty email or empty password");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(user).values({
      name: name,
      email: email,
      password: hashedPassword,
      role: "EMPLOYEE",
    });
  } catch (error) {
    console.error("Could not register user", error);
    throw new Error("Could not register user");
  }
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
  newRole: any;
}) => {
  await db.update(user).set({ role: newRole }).where(eq(user.id, id)).execute();
};

export async function getTraits() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You most be signed in");
  }
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
    .where(eq(schema.user.id, userId));

  let strengths_arr = [];
  let areasOfOportunity_arr = [];

  for (let c = 0; c < res.length; c++) {
    if (res[c].kind == "AREA_OF_OPPORTUNITY") {
      areasOfOportunity_arr.push(res[c]);
    } else if (res[c].kind == "STRENGTH") {
      strengths_arr.push(res[c]);
    }
  }
  let traits = {
    strengths: strengths_arr,
    areasOfOportunity: areasOfOportunity_arr,
  };
  return traits;
}

export async function getCoWorkers() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You most be signed in");
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
        eq(schema.projectMember.userId, userId!),
        eq(schema.project.managerId, userId!),
      ),
    );
  return res;
}

/*-- GET ALL TRAITS
SELECT p.*
FROM project_member pm
JOIN project p ON pm.project_id = p.id
WHERE pm.user_id = '5c0bbaeb-d54a-4fc3-a404-afaac7c7a47f';
 */
