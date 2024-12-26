import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipelineActions from "aws-cdk-lib/aws-codepipeline-actions";
import * as codebuild from "aws-cdk-lib/aws-codebuild";

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
    
    const reactPipeline = new codepipeline.Pipeline(this, "ReactPipeline", {
      pipelineName: `react-app-pipeline`,
    });

    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipelineActions.CodeStarConnectionsSourceAction({
      actionName: "GithubCommit",
      connectionArn:
        "arn:aws:codeconnections:eu-west-1:794038234271:connection/0e9bffa5-02cb-4512-9be7-425f5c2dd17a",
      owner: "vicenxl",
      repo: "my-react-app",
      branch: "main",
      output: sourceOutput,
    });

    const project = new codebuild.PipelineProject(this, "ReactProject", {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        env: {
          shell: "bash",
        },
        phases: {
          pre_build: {
            commands: ["echo $CODEBUILD_RESOLVED_SOURCE_VERSION", "npm install"],
          },
          build: {
            commands: ["echo Build started on `date`", "npm run build"],
          },
          post_build: {
            commands: ["echo Build completed on `date`"],
          },
        },
        artifacts: {
          files: ["**/*"],
          "base-directory": "build",
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
        computeType: codebuild.ComputeType.MEDIUM,
      },
    });

    const buildOutput = new codepipeline.Artifact();
    const buildAction = new codepipelineActions.CodeBuildAction({
      actionName: "CodeBuild",
      project,
      input: sourceOutput,
      outputs: [buildOutput],
    });

    const deployAction = new codepipelineActions.S3DeployAction({
      actionName: "DeployAction",
      bucket,
      input: buildOutput,
    });

    reactPipeline.addStage({
      stageName: "Source",
      actions: [sourceAction],
    });
    reactPipeline.addStage({
      stageName: "Build",
      actions: [buildAction],
    });
    reactPipeline.addStage({
      stageName: "Deploy",
      actions: [deployAction],
    });
  }
}
