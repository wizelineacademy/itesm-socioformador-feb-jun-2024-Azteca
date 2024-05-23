import { SQSMessageBody } from "@/types/types";

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
  const messageBody = JSON.parse(event.Records[0].body) as SQSMessageBody;

  const min = 10000; // 10 seconds in milliseconds
  const max = 30000; // 30 seconds in milliseconds
  const randomDuration = Math.floor(Math.random() * (max - min + 1)) + min;

  // Set the timeout with the random duration
  setTimeout(() => {
    console.log(messageBody);
  }, randomDuration);

  return "ok";
};
