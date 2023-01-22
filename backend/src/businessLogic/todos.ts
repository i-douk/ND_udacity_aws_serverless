import { TodoItem } from '../models/TodoItem';
import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export async function getTodosForUser (userId: string) : Promise<TodoItem[]> {
    const result = await dynamoDb.query({
        TableName: 'todos',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()
     return result.Items.map((item: TodoItem) => item);
}
