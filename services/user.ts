"use server";

import * as schema from "@/db/schema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { join } from "path";
import { alias } from "drizzle-orm/pg-core";
import { use } from "react";

export async function getInfoById() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You most be signed in");
  }
  const res = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, userId));
  return res[0];
}

export async function getTraits() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You most be signed in");
  }
  const res = await db
    .select()
    .from(schema.userTrait)
    .leftJoin(schema.user, eq(schema.userTrait.userId, schema.user.id))
    .leftJoin(schema.trait, eq(schema.userTrait.traitId, schema.trait.id))
    .where(eq(schema.user.id, userId));
  return res[0];
}

export async function getCoWorkers() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You most be signed in");
  }
  const pm = alias(schema.projectMember, "pm");
  const pm2 = alias(schema.projectMember, "pm2");
  const res = await db
    .selectDistinct()
    .from(pm)
    .leftJoin(pm, eq(pm.projectId, pm2.projectId))
    .leftJoin(schema.user, eq(schema.user.id, pm2.userId))
    .where(eq(schema.user.id, userId));
  return res[0];
}

// feedbackflow_db=# SELECT DISTINCT u.*
// FROM project_member pm
// JOIN project_member pm2 ON pm.project_id = pm2.project_id
// JOIN _user u ON u.id = pm2.user_id
// WHERE pm.user_id = 'user_2ey70SzI6BPQtP9V7oDXnLwOAnA';
// feedbackflow_db=#
// feedbackflow_db=#
