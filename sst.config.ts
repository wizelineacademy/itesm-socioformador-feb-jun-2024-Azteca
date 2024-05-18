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
    const bucket = new sst.aws.Bucket("FeedbackFlowBucket", {
      public: true,
    });

    new sst.aws.Nextjs("FeedbackFlowAppf", {
      link: [bucket],
    });
  },
});
