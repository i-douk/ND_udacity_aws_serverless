import uuid from 'uuid'

import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoDataLayer } from '../helpers/todosAcess';
import { TodoItem, TodoItemU } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import * as utils from '../lambda/utils'

const todoDataLayer = new TodoDataLayer()
const logger = createLogger('todos')

export async function getAllTodos(event): Promise<TodoItem[]> {

  logger.info('getAllTodos', { event })

  const todoItemU: TodoItemU = {
    userId: utils.getUserId(event)
  }

  return todoDataLayer.getAllTodos(todoItemU)

}

export async function createTodo(event): Promise<TodoItem> {

  logger.info('createTodo', { event })

  const parsedTodo: CreateTodoRequest = JSON.parse(event.body)

  const todoItemU: TodoItemU = {
    userId: utils.getUserId(event),
    todoId: uuid.v4(),
    createdAt: new Date().toDateString(),
    name: parsedTodo.name,
    dueDate: parsedTodo.dueDate,
    done: false,
    attachmentUrl: '',
  }

  return todoDataLayer.createTodo(todoItemU)

}

export async function deleteTodo(event): Promise<String> {

  logger.info('deleteTodo', { event })

  const todoItemU: TodoItemU = {
    userId: utils.getUserId(event),
    todoId: event.pathParameters.todoId
  }

  return todoDataLayer.deleteTodo(todoItemU)

}

export async function updateTodo(event): Promise<String> {

  logger.info('updateTodo', { event })

  const todo: UpdateTodoRequest = JSON.parse(event.body)

  const todoItemU: TodoItemU = {
    userId: utils.getUserId(event),
    todoId: event.pathParameters.todoId,
    name: todo.name,
    dueDate: todo.dueDate,
    done: todo.done
  }

  return todoDataLayer.updateTodo(todoItemU)

}

export async function generateUploadUrl(event): Promise<String> {

  logger.info('generateUploadUrl', { event })

  const todoItemU: TodoItemU = {
    userId: utils.getUserId(event),
    todoId: event.pathParameters.todoId
  }

  return todoDataLayer.generateUploadUrl(todoItemU)

}

