import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../models/TodoItem'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export async function createTodo(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const userId = getUserId(event)

  const newItem: TodoItem = {
    todoId: todoId,
    userId: userId,
    createdAt: createdAt,
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done: false,
  }

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }

