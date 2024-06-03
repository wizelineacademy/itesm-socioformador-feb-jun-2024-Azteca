import { feedbackAnalysis } from "@/services/rag";
import { DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { Resource } from "sst";

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
  const messageBody = JSON.parse(event.Records[0].body) as {
    sprintSurveyId: number;
  };
  console.log("HANDLER", messageBody.sprintSurveyId);
  console.log("RECORDS", event.Records);

  // Note: we should wrap everything inside a try-catch block to avoid putting SQS messages in retention state
  try {
    await feedbackAnalysis(messageBody.sprintSurveyId);
  } catch (error) {
    console.log("ERROR:", error);
  }

  const client = new SQSClient();
  const response = await client.send(
    new DeleteMessageCommand({
      QueueUrl: Resource.FeedbackFlowQueueV3.url,
      ReceiptHandle: event.Records[0].receiptHandle,
    }),
  );

  console.log("del response", response);

  return "ok";
};
