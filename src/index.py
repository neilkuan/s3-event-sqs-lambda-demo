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
    
test = {"Records": [ 
    {"body": "I am good", "messageId": "1"},
    {"body": "I am good", "messageId": "2"},
    {"body": "I am failed", "messageId": "3"},
    {"body": "I am good", "messageId": "4"}
    ]}
a = handler(test,123)
print(a)
