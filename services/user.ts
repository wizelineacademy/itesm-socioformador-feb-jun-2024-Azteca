"use server";

import { projectMember, trait, user, userTrait } from "@/db/schema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { auth } from "@/auth";

export async function getInfoById() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("You must be signed in");

  const res = await db.select().from(user).where(eq(user.id, userId));
  return res[0];
}

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
