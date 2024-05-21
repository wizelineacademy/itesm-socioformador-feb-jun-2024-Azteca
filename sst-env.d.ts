/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    AuthSecret: {
      type: "sst.sst.Secret"
      value: string
    }
    FeedbackFlowBucket: {
      name: string
      type: "sst.aws.Bucket"
    }
    FeedbackFlowQueue: {
      type: "sst.aws.Queue"
      url: string
    }
    PostgresURL: {
      type: "sst.sst.Secret"
      value: string
    }
  }
}
export {}