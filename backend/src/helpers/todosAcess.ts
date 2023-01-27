import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import AWSXRay from 'aws-xray-sdk-core';
import * as originalAws from 'aws-sdk'

import { TodoItem } from '../models/TodoItem'

const AWS = AWSXRay.captureAWS(originalAws);

export class TodoDataLayer {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly s3 = new AWS.S3({ signatureVersion: 'v4' }),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly imageBucketName = process.env.TODOS_S3_BUCKET,
    private readonly signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly todoIdIndex = process.env.TODOS_CREATED_AT_INDEX) {
  }

  async getAllTodos(todoItemU): Promise<TodoItem[]> {

    const param = {
      TableName: this.todosTable,
      IndexName: this.todoIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': todoItemU.userId
      }
    }

    const result = await this.docClient.query(param).promise()
    const items = result.Items

    return items as TodoItem[]

  }

  async createTodo(todoItemDTO): Promise<TodoItem> {

    const param = {
      TableName: this.todosTable,
      Item: todoItemDTO
    }

    await this.docClient.put(param).promise()

    return todoItemDTO as TodoItem
  }

  async deleteTodo(todoItemDTO): Promise<String> {

    const param = {
      TableName: this.todosTable,
      Key: {
        "userId": todoItemDTO.userId,
        "todoId": todoItemDTO.todoId
      }
    }

    await this.docClient.delete(param).promise()

    return "todo deleted"
  }

  async updateTodo(todoItemDTO): Promise<String> {

    const param = {
      TableName: this.todosTable,
      Key: {
        "userId": todoItemDTO.userId,
        "todoId": todoItemDTO.todoId
      },
      UpdateExpression: "set #tn = :n, dueDate=:dd, done=:d",
      ExpressionAttributeNames: { '#tn': 'name' },
      ExpressionAttributeValues: {
        ":n": todoItemDTO.name,
        ":dd": todoItemDTO.dueDate,
        ":d": todoItemDTO.done
      }
    }

    await this.docClient.update(param).promise()

    return "todo updated"
  }

  async generateUploadUrl(todoItemDTO): Promise<String> {

    const signedUrl = await this.s3.getSignedUrl('putObject', {
      Bucket: this.imageBucketName,
      Key: todoItemDTO.todoId,
      Expires: this.signedUrlExpiration
    })

    const param = {
      TableName: this.todosTable,
      Key: {
        "userId": todoItemDTO.userId,
        "todoId": todoItemDTO.todoId
      },
      UpdateExpression: "set attachmentUrl = :a",
      ExpressionAttributeValues: {
        ":a": `https://${this.imageBucketName}.s3.amazonaws.com/${todoItemDTO.todoId}`
      }
    }

    await this.docClient.update(param).promise()

    return signedUrl
  }
}

