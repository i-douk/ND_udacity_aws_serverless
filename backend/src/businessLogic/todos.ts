import { UpdateTodoRequest } from './../../../client/src/types/UpdateTodoRequest';
import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { createLogger } from '../utils/logger';
import * as uuid from 'uuid';
import { TodoDataLayer } from '../dataLayer/todoAccess';
import { AttachmentUtils } from '../fileStorage/AttachmentUtils';


const logger = createLogger('todosBusinessLogic');

// Creating new instances of classes to fetch methods to apply datastoring logic to each function

const attachmentUtils = new AttachmentUtils();
const todoDatalayer = new TodoDataLayer();
const bucketName = process.env.TODOS_S3_BUCKET
// Create new todo when logged in

  export async function createTodo( newTodo : CreateTodoRequest, userId : string): Promise<TodoItem> {
    logger.info('createTodo called');
    const todoId = uuid.v4();
    const createdAt = new Date().toISOString();


      const newItem = {
          userId,
          todoId,
          createdAt,
          attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
          done : false,
          ...newTodo
      };
    return await todoDatalayer.createTodoItem(newItem);
  }

// Get list of all Todos in DynamoTable for logged User

  export async function getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('fetching todos for current user');
    try {
      const todos = await todoDatalayer.getTodosByUserId(userId);
      logger.info(`Todos of user: ${userId}`, JSON.stringify(todos));
      return todos;
    }catch (error){
      throw error.message('No todos found');
    }
  }

// Update Existing todo to "done" state

  export async function updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest): Promise<void> {
    logger.info(`Updating ${todoId}`);

    const todo = await todoDatalayer.getTodo(userId, todoId);
    if (!todo) {
        throw new Error('404');
    }
    logger.info('Updating todo: ', userId, updatedTodo);
    return await todoDatalayer.updateTodo(userId, todoId, updatedTodo);
}

// Delete given Todo and corresponding attachement for current  user

export async function deleteTodo(userId: string, todoId: string): Promise<void>{
  logger.info('delete S3 object', todoId);
  await attachmentUtils.deleteAttachment(todoId);
  logger.info('delete TODO item', userId, todoId);
  await todoDatalayer.deleteTodo(userId, todoId);
}

//Generating upload signed URL to store in S3 bucket


export async function generateUploadUrl(todoId: string): Promise<string> {
  logger.info(`Generating upload URL for attachment ${todoId}`)

  const uploadUrl = await attachmentUtils.getUploadUrl(todoId)

  return uploadUrl
}