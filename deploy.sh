#! /bin/bash

#Check if AWS CLI is installed
if ! [ -x "$(command -v aws)" ]; then
  echo 'Error: AWS CLI is not installed. Please install this before trying again' >&2
  exit 1
fi

#Download Cloudformation file
curl https://sb-tech-test.s3-ap-southeast-2.amazonaws.com/cloudformation.json --output template.json

#Check that we actually downloaded the file
if ! [  -f "template.yaml"  ]; then
  echo 'Error: Failed to download Cloudformation Template' >&2
  exit 1
fi

#Prompt for Cloudformation parameters
echo Enter the name of the private key to use for EC2
read privatekey

#Deploy to cloudformation
aws cloudformation deploy --template-file template.json --stack-name technical-test --parameter-overrides KeyName=$privatekey
