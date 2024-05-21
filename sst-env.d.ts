/* tslint:disable */
/* eslint-disable */
import "sst";
declare module "sst" {
  export interface Resource {
    FeedbackFlowBucket: {
      name: string;
      type: "sst.aws.Bucket";
    };
    FeedbackFlowQueue: {
      type: "sst.aws.Queue";
      url: string;
    };
  }
}
export {};
