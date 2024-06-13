import db from "@/db/drizzle";
import { finalSurvey, sprintSurvey } from "@/db/schema";
import {
  feedbackAnalysis,
  projectAnalysis,
  rulerAnalysis,
} from "@/services/rag";
import { DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { eq } from "drizzle-orm";
import { Resource } from "sst";
import type { SQSHandler } from "aws-lambda";
import type { SQSMessageBody } from "@/services/project";

export const handler: SQSHandler = async (event) => {
  const messageBody = JSON.parse(event.Records[0].body) as SQSMessageBody;

  // Note: we should wrap everything inside a try-catch block to avoid putting SQS messages in retention state
  switch (messageBody.type) {
    case "RULER":
      try {
        await rulerAnalysis(messageBody.id);
      } catch (error) {
        console.log("ERROR:", error);
      }
      break;
    case "SPRINT":
      // Process sprint survey
      try {
        await feedbackAnalysis(messageBody.id);
      } catch (error) {
        console.log("ERROR:", error);
      }

      // Set the isProcessing state to false
      await db
        .update(sprintSurvey)
        .set({
          isProcessing: false,
        })
        .where(eq(sprintSurvey.id, messageBody.id));
      break;
    case "FINAL":
      // Process final survey
      try {
        await projectAnalysis(messageBody.id);
      } catch (error) {
        console.log("ERROR:", error);
      }

      // Set the isProcessing state to false
      await db
        .update(finalSurvey)
        .set({
          isProcessing: false,
        })
        .where(eq(finalSurvey.id, messageBody.id));
      break;
    default:
      console.log("UNREACHABLE");
  }

  // Deletes the message from the queue
  const client = new SQSClient();
  const response = await client.send(
    new DeleteMessageCommand({
      QueueUrl: Resource.FeedbackFlowQueueV3.url,
      ReceiptHandle: event.Records[0].receiptHandle,
    }),
  );
  console.log("del response", response);
};
