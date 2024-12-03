AWS Migration Project
This project demonstrates the deployment of a secure AWS infrastructure using AWS CDK with TypeScript. It includes a VPC, an EC2 instance in a public subnet, and an RDS instance in a private subnet, with proper security group configurations to allow controlled communication.

Setup Instructions

1. Prerequisites
   Install Node.js (v14+ recommended).
   Install the AWS CLI and configure it with your credentials:
   aws configure
   Install AWS CDK globally:
   npm install -g aws-cdk

2. Clone the Repository
   Clone this project to your local machine:
   git clone <repository-url>
   cd awsmigration

3. Install Dependencies
   Install all required dependencies:
   npm install

4. Configure Your Environment
   Set your public IP as an environment variable to restrict SSH access to the EC2 instance:
   export MY_IP="<your-public-ip>"
   You can find your public IP using a service like https://whatismyipaddress.com.

5. Synthesize the CloudFormation Templates
   Generate the CloudFormation templates from your CDK code:
   cdk synth

6. Deploy the Stacks
   Deploy all the stacks in the correct order:
   cdk deploy

7. Verify the Deployment
   VPC: Check the AWS Console to see the created VPC, subnets, and route tables.
   EC2 Instance: Note the public IP output in the terminal to SSH into the instance:
   ssh -i /path/to/your-key.pem ec2-user@<EC2_PUBLIC_IP>
   RDS Instance: Ensure the RDS instance is accessible from the EC2 instance using a MySQL or PostgreSQL client.
   Testing the Setup
   SSH into the EC2 instance:
   ssh -i /path/to/your-key.pem ec2-user@<EC2_PUBLIC_IP>
   Install a database client (e.g., MySQL):
   sudo yum install mysql -y
   Connect to the RDS instance from the EC2 instance:
   mysql -h <RDS_ENDPOINT> -u <USERNAME> -p

8. Project Cleanup
   To avoid incurring unnecessary costs, destroy the deployed resources when you're done:
   cdk destroy

Known Issues
Ensure the MY_IP environment variable is set correctly; otherwise, SSH traffic may be blocked.
Double-check IAM permissions for your AWS CLI profile to allow stack creation.
