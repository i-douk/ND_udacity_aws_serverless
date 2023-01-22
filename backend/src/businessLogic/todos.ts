import { TodoItem } from '../models/TodoItem'
import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })
  const bucketName = process.env.TODOS_S3_BUCKET

  export async function getTodosForUser(partitionKeyValue: string): Promise<TodoItem[]> {
    const result = await dynamoDb
    .query({
      TableName: todosTable,
      IndexName: process.env.TODOS_CREATED_AT_INDEX,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': partitionKeyValue
      }
    })
    .promise()
    return result.Items.map((item: TodoItem) => item)
  }

export async function updateTodo(todoId: string, updatedTodo: TodoItem, userId: string) {
  await dynamoDb
    .update({
      TableName: todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done
      },
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ReturnValues: 'UPDATED_NEW'
    })
    .promise()
}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
  await dynamoDb
    .delete({
      TableName: todosTable,
      Key: {
        todoId,
        userId
      }
    })
    .promise()
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    const attachmentId = `${todoId}/${userId}/${Date.now()}`
    const presignedUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: attachmentId,
      Expires: 300
    })
    return presignedUrl
  }
