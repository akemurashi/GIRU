import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

interface BackendStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  userPool: cognito.UserPool;
  dbSecret: secretsmanager.Secret;
}

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    // TODO: ECR repository + ECS Fargate (FastAPI) + API Gateway + ALB
  }
}
