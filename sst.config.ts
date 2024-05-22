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

    const bucket = new sst.aws.Bucket("FeedbackFlowBucket", {
      public: true,
    });

    const queue = new sst.aws.Queue("FeedbackFlowQueue", {
      fifo: false,
    });

    new sst.aws.Nextjs("FeedbackFlowAppf", {
      link: [bucket, queue, AuthSecret, PostgresURL],
      environment: {
        AUTH_SECRET: AuthSecret.value,
        POSTGRES_URL: PostgresURL.value,
      },
    });
  },
});
