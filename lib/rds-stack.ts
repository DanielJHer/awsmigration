import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

interface RdsStackProps extends cdk.StackProps {
  vpc: ec2.Vpc; // Accepts VPC from VPC stack
  ec2SecurityGroup: ec2.SecurityGroup; // Accepts EC2 Security Group
}

export class RdsStack extends cdk.Stack {
  public readonly rdsSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: RdsStackProps) {
    super(scope, id, props);

    // Security Group for RDS
    this.rdsSecurityGroup = new ec2.SecurityGroup(this, 'RDSecurityGroup', {
      vpc: props.vpc,
      description: 'Allow traffic from EC2 Instace',
      allowAllOutbound: true,
    });

    // Adding security rule to security group
    this.rdsSecurityGroup.addIngressRule(
      ec2.Peer.securityGroupId(props.ec2SecurityGroup.securityGroupId),
      ec2.Port.tcp(3306),
      'Allow SQL traffic from ec2 instance'
    );

    // Create RDS instnace
    new rds.DatabaseInstance(this, 'RDSInstance', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [this.rdsSecurityGroup],
      credentials: rds.Credentials.fromGeneratedSecret('admin'), // securely generate credentials
      allocatedStorage: 20,
      maxAllocatedStorage: 30,
      databaseName: 'MySQLDatabase',
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false,
      publiclyAccessible: false,
    });
  }
}
