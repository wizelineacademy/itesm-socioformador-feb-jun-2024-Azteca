/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "feedbackflowteamf",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  //PostgresPrismaUrl
  async run() {
    const myBucket = new sst.aws.Bucket("ProBucket", { public: true });

    const POSTGRES_URL = new sst.Secret("PostgresUrl");
    const POSTGRES_PRISMA_URL = new sst.Secret("PostgresPrismaUrl");
    const POSTGRES_USER = new sst.Secret("PostgresUser");
    const POSTGRES_HOST = new sst.Secret("PostgresHost");
    const POSTGRES_PASSWORD = new sst.Secret("PostgresPassword");
    const POSTGRES_DATABASE = new sst.Secret("PostgresDatabase");
    const AUTH_SECRET = new sst.Secret("AuthSecret");
    const POSTGRES_URL_NO_SSL = new sst.Secret("PostgresUrlNoSsl");
    const POSTGRES_URL_NON_POOLING = new sst.Secret("PostgresUrlNonPooling");

    new sst.aws.Nextjs("FeedbackFlowAppf", {
      link: [
        POSTGRES_URL,
        POSTGRES_PRISMA_URL,
        POSTGRES_USER,
        POSTGRES_HOST,
        POSTGRES_PASSWORD,
        POSTGRES_DATABASE,
        AUTH_SECRET,
        POSTGRES_URL_NO_SSL,
        POSTGRES_URL_NON_POOLING,
        myBucket,
      ],
      environment: {
        POSTGRES_URL: POSTGRES_URL.value,
        POSTGRES_PRISMA_URL: POSTGRES_PRISMA_URL.value,
        POSTGRES_USER: POSTGRES_USER.value,
        POSTGRES_HOST: POSTGRES_HOST.value,
        POSTGRES_PASSWORD: POSTGRES_PASSWORD.value,
        POSTGRES_DATABASE: POSTGRES_DATABASE.value,
        AUTH_SECRET: AUTH_SECRET.value,
        POSTGRES_URL_NO_SSL: POSTGRES_URL_NO_SSL.value,
        POSTGRES_URL_NON_POOLING: POSTGRES_URL_NON_POOLING.value,
      },
    });
  },
});
