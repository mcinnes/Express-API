# Technical Test

Matt McInnes Sparesbox Technical Test 2021

## Installation

### Option 1
Run on your local machine

Exposes API on port 3000

If you have a Mailgun account
1. Fill in the missing fields in ```env```
2. Copy ```env``` to ```.env```

If you don't you can download a copy of the CloudFormation .env from [here]('https://sb-tech-test.s3-ap-southeast-2.amazonaws.com/env')

Run the following commands to start the program

```bash
npm install 
npm run serve
```

### Option 2
Deploy to AWS using CloudFormation using deploy command

Depends on AWS CLI Tools, curl, bash

This executes the deploy.sh file in the project root and uses your configured AWS credentials

```bash
npm run deploy
```

### Option 3
Deploy to AWS using CloudFormation manually

Depends on AWS CLI Tools

From the project root run, replace $privateKey with the name of an available key

```bash
aws cloudformation deploy --template-file template.json --stack-name technical-test --parameter-overrides KeyName=$privatekey
```

## Documentation

Swagger API files are provided with the project

These can be accessed at the root of the API or in the ```/static/swagger``` folder of the project

```http://127.0.0.1:3000/``` will return the raw JSON data

```http://127.0.0.1:3000/?format=html``` will return a rendered HTML page of the documentation


## Testing

Tests have been written using the [Mocha](https://mochajs.org/) library

Tests are located in the ```test``` folder of the project

To execute them run the following commands, this will install all dependencies including Mocha

```bash
npm install 
npm run test
```


## Compromises/Reasoning
SQLite was chosen due to the portability and quick setup. If the project was any larger than this or expected to grow larger I would have used a full-fledged RDBMS and ORM

Deployment script has only been tested on macOS due to time constraints


## General Information

### API

Express as the router/server

Mocha as the testing framework

Chai as the assertion library

Mailgun as the email service

### CloudFormation

Deploys a t2.small EC2 instance running Amazon Linux

Installs git, Docker, curl

Downloads Dockerfile, .env from S3

Runs git clone against the Github repository [here]('https://github.com/mcinnes/Express-API')
