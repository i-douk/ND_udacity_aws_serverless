import { TodoItem } from '../models/TodoItem'
import * as todosAccess from './todosAcess'
import * as attachmentUtils from './attachmentUtils'

export async function getTodosForUser(partitionKeyValue: string): Promise<TodoItem[]> {
  try {
    const todos = await todosAccess.getTodosForUser(partitionKeyValue)
    return todos
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function updateTodo(todoId: string, updatedTodo: TodoItem, userId: string) {
  try {
    await todosAccess.updateTodo(todoId, updatedTodo, userId)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
  try {
    await todosAccess.deleteTodo(todoId, userId)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
  try {
    const url = await attachmentUtils.createAttachmentPresignedUrl(todoId, userId)
    return url
  } catch (error) {
    console.log(error)
    throw error
  }
}
