import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('TodosAccess');

//   private readonly s3 = new AWS.S3({ signatureVersion: 'v4' }),
//   private readonly bucketName = process.env.TODOS_S3_BUCKET,
//   private readonly signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION,

// Todo Data Layer Class
export class TodoDataLayer {
    constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly todosTable = process.env.TODOS_TABLE,
      private readonly todoIdIndex = process.env.TODOS_CREATED_AT_INDEX,
      )
       {}

// Create todo TotoItem type using put method       
      async createTodoItem(newTodo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
          TableName: this.todosTable,
          Item: newTodo
        }).promise();
        logger.info("todo created" , newTodo.name);
        return newTodo;
      }

//Get All todo by User 
      async  getTodosByUserId(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient
          .query({
            TableName: this.todosTable,
            IndexName: this.todoIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            }
          })
          .promise();
      
        const items = result.Items;
        logger.info(`All todos for user ${userId} were fetched`);
        return items as TodoItem[];
      }

//Update todo to done state and store it in table
      async updateTodo(userId: string, todoId: string, updatedTodo: TodoUpdate): Promise<void> {
        await this.docClient.update({
          TableName: this.todosTable,
          Key: { userId, todoId },
          UpdateExpression: "set #name = :n, dueDate=:dueDate, done=:done",
          ExpressionAttributeValues: {
            ":n": updatedTodo.name,
            ":dueDate": updatedTodo.dueDate,
            ":done": updatedTodo.done
          },
          ExpressionAttributeNames: { '#name': 'name' },
          ReturnValues: "NONE"
        }).promise()
      }
      async getTodo(userId: string, todoId: string): Promise<TodoItem> {
        const result = await this.docClient
          .get({
            TableName: this.todosTable,
            Key: { userId, todoId }
          })
          .promise()
    
        return result.Item as TodoItem
      }

      async deleteTodo(userId: string, todoId: string): Promise<void> {
        await this.docClient.delete({
          TableName: this.todosTable,
          Key: { userId, todoId }
        }).promise()
      }

      
  async updateAttachmentUrl(todoId: string, attachmentUrl: string) {
    logger.info(`Updating attachment URL for todo ${todoId} in ${this.todosTable}`)

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise()
  }

    }