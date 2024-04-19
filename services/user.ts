"use server";

import {
  projectMember,
  trait,
  user,
  userTrait,
  userRoleEnum,
} from "@/db/schema";
import db from "@/db/drizzle";
import { asc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { auth } from "@/auth";
import bcrypt from "bcrypt";

export async function getInfoById() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const res = await db.select().from(user).where(eq(user.id, userId));
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
  const userId = "TODO: implement nextauth";
  if (!userId) {
    throw new Error("You most be signed in");
  }
  const res = await db
    .select()
    .from(userTrait)
    .leftJoin(user, eq(userTrait.userId, user.id))
    .leftJoin(trait, eq(userTrait.traitId, trait.id))
    .where(eq(user.id, userId));
  return res[0];
}

export async function getCoWorkers() {
  const userId = "TODO: implement nextauth";
  if (!userId) {
    throw new Error("You most be signed in");
  }
  const pm = alias(projectMember, "pm");
  const pm2 = alias(projectMember, "pm2");
  const res = await db
    .selectDistinct()
    .from(pm)
    .leftJoin(pm, eq(pm.projectId, pm2.projectId))
    .leftJoin(user, eq(user.id, pm2.userId))
    .where(eq(user.id, userId));
  return res[0];
}

// feedbackflow_db=# SELECT DISTINCT u.*
// FROM project_member pm
// JOIN project_member pm2 ON pm.project_id = pm2.project_id
// JOIN _user u ON u.id = pm2.user_id
// WHERE pm.user_id = 'user_2ey70SzI6BPQtP9V7oDXnLwOAnA';
// feedbackflow_db=#
// feedbackflow_db=#
