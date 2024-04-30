"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { finalSurvey, finalSurveyAnswer } from "@/db/schema";
import { eq, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectAnswer } from "@/types";
import { comment } from "postcss";

export async function createProjectSurvey(projectId: number) {
  const res = await db
    .insert(finalSurvey)
    .values({ created_at: sql`CURRENT_TIMESTAMP`, projectId: projectId })
    .returning({ id: finalSurvey.id });

  return res[0];
}

export async function submitProjectAnswer(answers: ProjectAnswer) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You most be signed in");
  }
  console.log(userId);
  console.log(answers); // TODO: remove this console log

  await db.insert(finalSurveyAnswer).values(
    answers.answers.map((item) => ({
      userId: userId,
      finalSurveyId: answers.finalSurveyId,
      questionName: item.questionKey,
      answer: item.answer,
      comment: "",
    })),
  );
  console.log("i did it");
  await db.insert(finalSurveyAnswer).values({
    userId: userId,
    finalSurveyId: answers.finalSurveyId,
    questionName: "PS_CT",
    answer: null,
    comment: answers.comment,
  });
}
