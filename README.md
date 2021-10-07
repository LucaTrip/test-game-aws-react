# React app with AWS Lambda, AWS API Gateway, AWS DynamoDB and AWS S3

This project shown the process to create a serverless app in React using some AWS tools, in particular:

- AWS Lambda, allowing us to create a serverless app
- AWS API Gateway, allows us to configure endpoints to be called up later in the app
- AWS DynamoDB, allowing us to save data with a NoSQL database
- AWS S3, an object storage for storing and retrieving any data

It was implemented also a login/signup page to authenticate Client using OAuth.

With this app, once logged in, you can see all the users you have created, add new ones or edit their attributes.

## Available Scripts

Once the project has been downloaded, runs the command below to start app locally

```bash
npm install
npm start
```

## Create DynamoDB table

There are some screenshots of the various steps in

> screenshots/aws-dynamoDB

## Create the IAM role for the Lambda function

This is important to create before the lambda because it defines the actions that we can do with lambda function.

Important policies to set:

- CloudWatchLogsFullAccess
- AmazonDynamoDBFullAccess

There are some screenshots of the various steps in

> screenshots/aws-iam-role

## Create Lambda function

The backend source code are [here!](https://github.com/LucaTrip/test-game-aws-backend).

There are some screenshots of the various steps in

> screenshots/aws-lambda

## Create API Gateway

There are some screenshots of the various steps in

> screenshots/aws-api

## Create a S3 bucket

In this project, I've created a public bucket, so AWS'll give me a public url to call.
To use it, I've created an IAM Policie and IAM User. Policies said what type of actions an user can do, for example this user is allowed to put image to S3 bucket.

At the end of user creation process, AWS gives us an ACCESS KEY ID and SECRET ACCESS KEY. These keys must be set correctly in the backend configuration

There are some screenshots of the various steps in

> screenshots/aws-s3
