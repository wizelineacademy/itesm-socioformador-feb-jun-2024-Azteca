"use server";
import db from "@/db/drizzle";
import { rulerSurveyAnswers } from "@/db/schema";
import { sql } from "drizzle-orm";

import { RulerSurveyAnswer } from "@/types/types";
import { auth } from "@/auth";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Resource } from "sst";
import type { SQSMessageBody } from "./project";

export async function submitRulerSurveyAnswer(surveyAnswer: RulerSurveyAnswer) {
  if (!surveyAnswer.userId || surveyAnswer.userId === undefined) {
    const session = await auth();
    surveyAnswer.userId = session?.user?.id;
    if (!surveyAnswer.userId) {
      throw new Error("You most be signed in");
    }
  }
  // Insert ruler answer to db
  // const answeredAt = new Date(
  //   new Date().toLocaleString("es-MX", { timeZone: "America/Monterrey" }),
  // );

  await db.insert(rulerSurveyAnswers).values({
    userId: surveyAnswer.userId,
    emotionId: surveyAnswer.emotion?.id,
    answeredAt: sql`CURRENT_TIMESTAMP`,
    comment: surveyAnswer.comment,
  });

  // Sends ruler survey to the queue
  const client = new SQSClient();
  const messageGroupId = crypto.randomUUID();
  const response = await client.send(
    new SendMessageCommand({
      QueueUrl: Resource.FeedbackFlowQueueV3.url,
      MessageGroupId: messageGroupId,
      MessageDeduplicationId: crypto.randomUUID(),
      MessageBody: JSON.stringify({
        id: 1,
        type: "RULER",
      } as SQSMessageBody),
    }),
  );
  console.log("response ruler survey", response);
}
