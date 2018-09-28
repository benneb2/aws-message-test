# AWS serverless message service

### Local Invoke
    - sam local invoke --event get_message.json
    - sam local invoke --event post_message.json

### Build
aws cloudformation package --template-file template.yml --s3-bucket <bucketname> --output-template-file packaged-template.yaml

### Deploy
aws --region us-east-1 cloudformation deploy --template-file packaged-template.yaml --stack-name <stackname> --capabilities CAPABILITY_IAM
