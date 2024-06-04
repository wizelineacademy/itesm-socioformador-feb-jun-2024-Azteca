// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "feedbackflowteamf",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
    };
  },

  async run() {
    const AuthSecret = new sst.Secret("AuthSecret");
    const PostgresURL = new sst.Secret("PostgresURL");
    const OpenAIKey = new sst.Secret("OpenAIKey");

    const bucket = new sst.aws.Bucket("FeedbackFlowBucket", {
      public: true,
    });

    const queue = new sst.aws.Queue("FeedbackFlowQueueV3", {
      fifo: true,
      transform: {
        queue: {
          visibilityTimeoutSeconds: 900 * 6,
        },
      },
    });

    queue.subscribe(
      {
        link: [queue, PostgresURL],
        handler: "handlers/subscriber.handler",
        environment: {
          POSTGRES_URL: PostgresURL.value,
          OPENAI_KEY: OpenAIKey.value,
        },
        timeout: "900 seconds",
        runtime: "nodejs20.x",
      },
      {
        transform: {
          eventSourceMapping: {
            batchSize: 1,
          },
        },
      },
    );

    new sst.aws.Nextjs("FeedbackFlowAppf", {
      link: [bucket, queue, AuthSecret, PostgresURL],
      environment: {
        AUTH_SECRET: AuthSecret.value,
        POSTGRES_URL: PostgresURL.value,
      },
    });
  },
});
