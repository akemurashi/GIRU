#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { NetworkStack } from '../lib/network-stack';
import { FrontendStack } from '../lib/frontend-stack';
import { DatabaseStack } from '../lib/database-stack';
import { BackendStack } from '../lib/backend-stack';
import { AuthStack } from '../lib/auth-stack';

const app = new cdk.App();

const stage = app.node.tryGetContext('stage') ?? 'dev';

const accounts: Record<string, string> = {
  dev: '848518356887',
  prd: '319246816643',
};

const domains: Record<string, string> = {
  dev: 'dev.giru.exumbria.cl',
  prd: 'giru.exumbria.cl',
};

const env = {
  account: accounts[stage],
  region: 'us-east-1',
};

const network = new NetworkStack(app, 'GiruNetworkStack', { env });
const database = new DatabaseStack(app, 'GiruDatabaseStack', { env, vpc: network.vpc });
const auth = new AuthStack(app, 'GiruAuthStack', { env });
new BackendStack(app, 'GiruBackendStack', {
  env,
  vpc: network.vpc,
  userPool: auth.userPool,
  dbSecret: database.dbSecret,
});
new FrontendStack(app, 'GiruFrontendStack', {
  env,
  userPool: auth.userPool,
  domainName: domains[stage],
});
