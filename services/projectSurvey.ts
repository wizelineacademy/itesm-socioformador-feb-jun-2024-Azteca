"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { finalSurvey, finalSurveyAnswer } from "@/db/schema";
import { eq, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectAnswer } from "@/types/types";
import { comment } from "postcss";

export async function createProjectSurvey(projectId: number) {
  const res = await db
    .insert(finalSurvey)
    .values({ scheduledAt: sql`CURRENT_TIMESTAMP`, projectId: projectId })
    .returning({ id: finalSurvey.id });

  return res[0];
}

export async function submitProjectAnswer(answers: ProjectAnswer) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You most be signed in");
  }

  await db.insert(finalSurveyAnswer).values(
    answers.answers.map((item) => ({
      userId: userId,
      finalSurveyId: answers.finalSurveyId,
      questionName: item.questionKey,
      answer: item.answer,
      comment: "",
    })),
  );
  // TODO: felipe pls fix this
  // await db.insert(finalSurveyAnswer).values({
  //   userId: userId,
  //   finalSurveyId: answers.finalSurveyId,
  //   questionName: "PS_CT",
  //   answer: null,
  //   comment: answers.comment,
  // });
}
