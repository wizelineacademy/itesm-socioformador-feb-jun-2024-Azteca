/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    AuthSecret: {
      type: "sst.sst.Secret"
      value: string
    }
    FeedbackFlowAppf: {
      type: "sst.aws.Nextjs"
      url: string
    }
    FeedbackFlowBucket: {
      name: string
      type: "sst.aws.Bucket"
    }
    FeedbackFlowQueueV3: {
      type: "sst.aws.Queue"
      url: string
    }
    OpenAIKey: {
      type: "sst.sst.Secret"
      value: string
    }
    PostgresURL: {
      type: "sst.sst.Secret"
      value: string
    }
  }
}
export {}