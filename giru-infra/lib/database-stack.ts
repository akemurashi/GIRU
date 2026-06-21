import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

interface DatabaseStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class DatabaseStack extends cdk.Stack {
  readonly dbSecret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    // TODO: RDS PostgreSQL (db.t3.micro) + pgvector extension
    this.dbSecret = new secretsmanager.Secret(this, 'GiruDbSecret', {
      description: 'GIRU RDS PostgreSQL credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'giruadmin' }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\',
      },
    });
  }
}
