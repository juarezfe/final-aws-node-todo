const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient, ScanCommand
} = require("@aws-sdk/lib-dynamodb");
const uuid = require("uuid")
const TODO_TABLE = process.env.TODO_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

module.exports.listTodos = async (event, context, callback) => {

    const params = {
        TableName: TODO_TABLE,
    }

    try {
        const { Items } = await dynamoDb.send(new ScanCommand(params))
        const response = {
            statusCode: 200,
            body: JSON.stringify(Items)
        };
        callback(null, response)
    } catch (error) {
        callback(new Error(error));
    }
}