#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CursoCdkPrimerPipelineStack } from "../lib/curso-cdk-primer-pipeline-stack";

const app = new cdk.App();
new CursoCdkPrimerPipelineStack(app, "CursoCdkPrimerPipelineStack", {
  env: { account: "038462756361", region: "eu-west-1" },
});
