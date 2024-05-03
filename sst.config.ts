/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "FeedbackFlowvf",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  //
  async run() {
    const POSTGRES_URL = new sst.Secret("PostgresUrl", {
      value: process.env.POSTGRES_URL,
    });
    const POSTGRES_PRISMA_URL = new sst.Secret("PostgresPrismaUrl", {
      value: process.env.POSTGRES_PRISMA_URL,
    });
    const POSTGRES_USER = new sst.Secret("PostgresUser", {
      value: process.env.POSTGRES_USER,
    });
    const POSTGRES_HOST = new sst.Secret("PostgresHost", {
      value: process.env.POSTGRES_HOST,
    });
    const POSTGRES_PASSWORD = new sst.Secret("PostgresPassword", {
      value: process.env.POSTGRES_PASSWORD,
    });
    const POSTGRES_DATABASE = new sst.Secret("PostgresDatabase", {
      value: process.env.POSTGRES_DATABASE,
    });
    const AUTH_SECRET = new sst.Secret("AuthSecret", {
      value: process.env.AUTH_SECRET,
    });

    new sst.aws.Nextjs("Nextjs1", {
      link: [
        POSTGRES_URL,
        POSTGRES_PRISMA_URL,
        POSTGRES_USER,
        POSTGRES_HOST,
        POSTGRES_PASSWORD,
        POSTGRES_DATABASE,
        AUTH_SECRET,
      ],
      environment: {
        POSTGRES_URL: POSTGRES_URL.value,
        POSTGRES_PRISMA_URL: POSTGRES_PRISMA_URL.value,
        POSTGRES_USER: POSTGRES_USER.value,
        POSTGRES_HOST: POSTGRES_HOST.value,
        POSTGRES_PASSWORD: POSTGRES_PASSWORD.value,
        POSTGRES_DATABASE: POSTGRES_DATABASE.value,
        AUTH_SECRET: AUTH_SECRET.value,
      },
    });
  },
});
