import AWS from 'aws-sdk'
import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export async function createTodo(newTodo: TodoItem, userId: string): Promise<TodoItem> {
    const timestamp = new Date().toISOString()
    const newItem = {
        ...newTodo,
        userId,
        createdAt: timestamp,
        todoId: uuid.v4()
    }
    await dynamoDb.put({
        TableName: 'todos',
        Item: newItem
    }).promise()
    return newItem
}
