import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { Ec2Stack } from '../lib/ec2-stack';
import { RdsStack } from '../lib/rds-stack';

const app = new cdk.App();

// Create VPC stack
const vpcStack = new VpcStack(app, 'VpcStack');

// Create EC2 stack
const ec2Stack = new Ec2Stack(app, 'Ec2Stack', {
  vpc: vpcStack.vpc,
});

// Create RDS stack
const rdsStack = new RdsStack(app, 'RdsStack', {
  vpc: vpcStack.vpc,
  ec2SecurityGroup: ec2Stack.ec2SecurityGroup,
});
