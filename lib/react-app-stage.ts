import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ReactAppStack } from "./react-app-stack";

export class ReactAppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new ReactAppStack(this, "ReactAppStack");
  }
}
