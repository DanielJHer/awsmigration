import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

// accept VPC from VPC stack
interface Ec2StackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

// define ec2 stack
export class Ec2Stack extends cdk.Stack {
  public readonly ec2SecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: Ec2StackProps) {
    super(scope, id, props);

    // Security Group for EC2
    const ec2SecurityGroup = new ec2.SecurityGroup(this, 'EC2SecurityGroup', {
      vpc: props.vpc,
      description: 'Allow SSH access from IP',
      allowAllOutbound: true,
    });

    // My public IP address with environment variable
    const myIp = process.env.MY_IP ?? '0.0.0.0/32';

    ec2SecurityGroup.addIngressRule(
      ec2.Peer.ipv4(myIp),
      ec2.Port.tcp(22),
      'Allow SSH access from my IP address'
    );

    // IAM role for EC2 Instance
    const ec2Role = new iam.Role(this, 'EC2InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    ec2Role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
    );

    // EC2 Instance
    const ec2Instance = new ec2.Instance(this, 'EC2Instance', {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      securityGroup: ec2SecurityGroup,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      role: ec2Role,
    });

    // Output the public IP of the EC2 Instance
    new cdk.CfnOutput(this, 'EC2PublicIP', {
      value: ec2Instance.instancePublicIp,
      description: 'Public IP of the ec2 instance',
    });
  }
}
