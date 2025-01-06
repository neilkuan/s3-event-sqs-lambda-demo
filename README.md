# s3-event-sqs-lambda-demo

source: https://docs.aws.amazon.com/lambda/latest/dg/example_serverless_SQS_Lambda_batch_item_failures_section.html

- event_source sqs:
  - reportBatchItemFailures: `true`
  - batchSize: `> 1`
  - catch and handle failure events, return `[{ "itemIdentifier": record['messageId'] }]`
  - example python code
```python
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
    return sqs_batch_response
```

# Example trigger upload files.
aws s3 sync . s3://${BUCKET_NAME}/
