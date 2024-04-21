/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "CodigoAztecaApp",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },

  async run() {
    const database = new sst.aws.Postgres("FeedbackFlowdb3", {
      scaling: {
        min: "2 ACU",
        max: "128 ACU",
      },
    });

    new sst.aws.Nextjs("MyWeb1", {
      link: [database],
    });
  },
});
