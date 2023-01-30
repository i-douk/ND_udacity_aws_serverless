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

  export async function getTodos(
    userId: string
  ): Promise<TodoItem[]> {
    try {
      const todos = await todoDatalayer.getTodosByUserId(userId)
      logger.info(`Todos of user: ${userId}`, JSON.stringify(todos))
      return todos
    } catch (error) {
      throw error.message('No todos found for you')
    }
  }
  