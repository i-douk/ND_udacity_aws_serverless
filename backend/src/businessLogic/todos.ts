import { UpdateTodoRequest } from './../../../client/src/types/UpdateTodoRequest';
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import { TodoDataLayer } from '../dataLayer/todoAccess'
import { AttachmentUtils } from '../fileStorage/AttachmentUtils'
// import { getUserId } from '../lambda/utils'
// import { parseUserId } from '../auth/utils'
// import { APIGatewayProxyEvent } from 'aws-lambda'


const logger = createLogger('todosBusinessLogic')
const attachmentUtils = new AttachmentUtils()
const todoDatalayer = new TodoDataLayer()

// TODO: Implement businessLogic
export async function createTodo( newTodo : CreateTodoRequest, userId : string): Promise<TodoItem> {
    logger.info('createTodo called')
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const newItem = {
        userId,
        todoId,
        createdAt,
        attachmentUrl: attachmentUrl,
        done : false,
        ...newTodo
    }
  
    return await todoDatalayer.createTodoItem(newItem)
  
  }

  export async function getTodos(userId: string): Promise<TodoItem[]> {
    try {
      const todos = await todoDatalayer.getTodosByUserId(userId)
      logger.info(`Todos of user: ${userId}`, JSON.stringify(todos))
      return todos
    } catch (error) {
      throw error.message('No todos found for you')
    }
  }


  export async function updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest): Promise<void> {
    const todo = await todoDatalayer.getTodo(userId, todoId)

    if (!todo) {
        throw new Error('404')
    }
    
    logger.info('Updating todo: ', userId, updatedTodo)
    return await todoDatalayer.updateTodo(userId, todoId, updatedTodo)
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {

  logger.info('delete S3 object', todoId)
  await attachmentUtils.deleteAttachment(todoId)
  logger.info('delete TODO item', userId, todoId)
  await todoDatalayer.deleteTodo(userId, todoId)
}

export async function createAttachmentPresignedUrl(todoId: string ,userId: string ): Promise<String> {

  const todo = await todoDatalayer.getTodo(userId, todoId)

  if (!todo) {
      throw new Error('Couldnt fetch Item 404')
  }
  
  logger.info('generating upload URL for todo: ', todo.todoId)
  return attachmentUtils.getUploadUrl(todo.todoId)
}