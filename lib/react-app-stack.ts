import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";

export class ReactAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "ReactAppBucket", {
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        ignorePublicAcls: false,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new s3Deployment.BucketDeployment(this, "ReactAppDeployment", {
      sources: [s3Deployment.Source.asset("./react-app")],
      destinationBucket: bucket,
    });
  }
}
