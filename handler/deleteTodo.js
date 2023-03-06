const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient, DeleteCommand
} = require("@aws-sdk/lib-dynamodb");
const TODO_TABLE = process.env.TODO_TABLE;
const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

module.exports.deleteTodo = async (event, context, callback) => {

    const params = {
        TableName: TODO_TABLE,
        Key: {
            id: event.pathParameters.id
        }
    }

    try {
        const { Item } = await dynamoDb.send(new DeleteCommand(params))
        const response = Item ? {
            statusCode: 200,
            body: JSON.stringify({data: "Deletion Successfull!"})
        } : {
            statusCode: 404,
            body: JSON.stringify({data: "Todo Not Found!"})

        }
        callback(null, response)
    } catch (error) {
        callback(new Error(error));
    }
}