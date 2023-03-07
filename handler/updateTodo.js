const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient, UpdateCommand
} = require("@aws-sdk/lib-dynamodb");
const TODO_TABLE = process.env.TODO_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

module.exports.updateTodo = async (event, context, callback) => {
    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);

    if (typeof data.todo !== "string" || typeof data.checked !== "boolean") {
        console.error("Value of todo or done is invalid")
        return;
    }
    
    const params = {
        TableName: TODO_TABLE,
        Key: {
            id: event.pathParameters.id
        },
        ExpressionAttributeNames: {
            "#todo_text": "todo"
        },
        ExpressionAttributeValues: {
            ":todo": data.todo,
            ":checked": data.checked,
            ":updatedAt": datetime
        },
        UpdateExpression:
            "SET #todo_text = :todo, checked = :checked, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW",
    }

    try {
        const data = await dynamoDb.send(new UpdateCommand(params))
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Attributes)
        }
        callback(null, response)
    } catch (error) {
        callback(new Error(error));
    }
}