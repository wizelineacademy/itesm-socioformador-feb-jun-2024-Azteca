import db from "@/db/drizzle";
import { pipTask, sprintSurvey } from "@/db/schema";
import { feedbackAnalysis } from "@/services/rag";
import { eq } from "drizzle-orm";

// TODO: this stuff should come from either @sst/sqs or @aws/sqs
interface Record {
  messageId: string;
  receiptHandle: string;
  body: string;
  md5OfBody: string;
  eventSource: string;
  eventSourceARN: string;
  awsRegion: string;
}

interface EventType {
  Records: Record[];
}

export const handler = async (event: EventType) => {
  // Note: we should wrap everything inside a try-catch block to avoid putting SQS messages in retention state
  try {
    const messageBody = JSON.parse(event.Records[0].body) as {
      sprintSurveyId: number;
    };
    await feedbackAnalysis(messageBody.sprintSurveyId);
  } catch (error) {
    console.log("ERROR:", error);
  }

  return "ok";
};
