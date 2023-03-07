const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand
} = require("@aws-sdk/lib-dynamodb");
const uuid = require("uuid")
const TODO_TABLE = process.env.TODO_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

module.exports.createTodo = async (event, context, callback) => {
    const timestamp = new Date().getTime()
    const data = JSON.parse(event.body)
    if (typeof data.todo !== "string") {
        console.error("Validation Failed");
        return;
    }

    const params = {
        TableName: TODO_TABLE,
        Item: {
            id: uuid.v1(),
            todo: data.todo,
            checked: false,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    }

    // Send the PutCommand to DynamoDB
    try {
        const data = await dynamoDb.send(new PutCommand(params));
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };
        callback(null, response)
    } catch (error) {
        callback(new Error(error));
    }
}