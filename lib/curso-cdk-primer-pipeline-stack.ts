import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as pipelines from "aws-cdk-lib/pipelines";
import * as iam from "aws-cdk-lib/aws-iam";
import { ReactAppStage } from "./react-app-stage";

export class CursoCdkPrimerPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, "CdkPipeline", {
      crossAccountKeys: true,
      synth: new pipelines.ShellStep("Synth", {
        input: pipelines.CodePipelineSource.connection(
          "vicenxl/curso-cdk-primer-pipeline",
          "main",
          {
            connectionArn:
              "arn:aws:codeconnections:eu-west-1:038462756361:connection/bba5d8ec-2f8b-4f05-a100-789c1bd7f6f9",
          }
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    pipeline.addStage(
      new ReactAppStage(this, "ReactAppStage", {
        env: { account: "038462756361", region: "eu-west-1" },
      })
    );

    pipeline.buildPipeline();

    pipeline.pipeline.artifactBucket.grantRead(new iam.AccountPrincipal("038462756361"));
  }
}
