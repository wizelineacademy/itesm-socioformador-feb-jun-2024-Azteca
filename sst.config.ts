/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "feedbackflowteamf",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },

  async run() {
    let secrets: sst.Secret[] = [];

    if (process.env.NODE_ENV === "production") {
      const AuthSecret = new sst.Secret("AuthSecret");
      const PostgresURL = new sst.Secret("PostgresURL");
      secrets = [AuthSecret, PostgresURL];
    }

    const bucket = new sst.aws.Bucket("FeedbackFlowBucket", {
      public: true,
    });

    const queue = new sst.aws.Queue("FeedbackFlowQueue", {
      fifo: false,
    });

    new sst.aws.Nextjs("FeedbackFlowAppf", {
      link: [...secrets, bucket, queue],
    });
  },
});
