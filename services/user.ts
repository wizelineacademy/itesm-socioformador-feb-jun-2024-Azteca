"use server";

import * as schema from "@/db/schema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { join } from "path";
import { alias } from "drizzle-orm/pg-core";
import { use } from "react";
import { auth } from "@/auth";

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
    .fullJoin(schema.userTrait, eq(schema.userTrait.traitId, schema.trait.id))
    .fullJoin(schema.user, eq(schema.userTrait.userId, schema.user.id))
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
    .fullJoin(pm2, eq(pm.projectId, pm2.projectId))
    .fullJoin(schema.user, eq(schema.user.id, pm2.userId))
    .where(eq(pm.userId, userId));

  const coworkers = res.filter((user) => user.id !== userId);
  return coworkers;
}

/*-- GET ALL TRAITS

-- GET ALL COWORKERS
SELECT DISTINCT u.*
FROM project_member pm
JOIN project_member pm2 ON pm.project_id = pm2.project_id
JOIN _user u ON u.id = pm2.user_id
WHERE pm.user_id != '1a0cf7e3b02d48f8b5d89c4f5fb37c21';

-- GET USER PROJECTS
SELECT DISTINCT project.* 
FROM project_member 
JOIN project ON project.id = project_member.project_id
JOIN _user ON _user.id = project_member.user_id
WHERE user_id = '1a0cf7e3b02d48f8b5d89c4f5fb37c21' OR project.manager_id = '1a0cf7e3b02d48f8b5d89c4f5fb37c21'; */
