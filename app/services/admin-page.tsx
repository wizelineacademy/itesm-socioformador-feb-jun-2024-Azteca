"use server";

import { user, userRoleEnum } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { revalidatePath } from "next/cache";

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
