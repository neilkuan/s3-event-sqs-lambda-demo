import { App, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3_notifications from 'aws-cdk-lib/aws-s3-notifications';
import * as lambda_event_sources from 'aws-cdk-lib/aws-lambda-event-sources';
export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 's3-event-sqs-lambda-demo', {
      bucketName: 's3-event-sqs-lambda-demo',
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const queue = new sqs.Queue(this, 's3-event-sqs-lambda-demo-queue',{
      queueName: 's3-event-sqs-lambda-demo-queue',
    });
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED, 
      new s3_notifications.SqsDestination(queue)
    );
    const sqsEventSource = new lambda_event_sources.SqsEventSource(queue, {
      reportBatchItemFailures: true,
      batchSize: 5,
    })
    const func = new lambda.Function(this, 's3-event-sqs-lambda-demo-func', {
      functionName: 's3-event-sqs-lambda-demo',
      handler: 'index.handler',
      runtime: lambda.Runtime.PYTHON_3_13,
      code: new lambda.InlineCode(`
def handler(event, context):
    print('event_len:', len(event['Records']))
    # Loop through each record in the event
    batch_item_failures = []
    sqs_batch_response = {}
    count = 0
    for record in event['Records']:
        try: 
           # Extract the message body
           message_body = record['body']
           count = count + 1
           if count == 3:
              # made failed.
              haha 
           print(f"Received message: {message_body}")
           # Optionally, process the message here
           print(f"Processing message: {message_body}")
           
        except Exception as e:
           print(e)
           batch_item_failures.append({ "itemIdentifier": record['messageId'] })
    sqs_batch_response["batchItemFailures"] = batch_item_failures
    print('batchItemFailures', sqs_batch_response)
    return sqs_batch_response`),
    });

    func.addEventSource(sqsEventSource);
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 's3-event-sqs-lambda-demo-dev', { env: devEnv });
// new MyStack(app, 's3-event-sqs-lambda-demo-prod', { env: prodEnv });

app.synth();