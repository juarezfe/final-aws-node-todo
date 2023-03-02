const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient
} = require("@aws-sdk/lib-dynamodb");

const TODO_TABLE = process.env.TODO_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

exports.createTodo = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Hello"})
    }
}