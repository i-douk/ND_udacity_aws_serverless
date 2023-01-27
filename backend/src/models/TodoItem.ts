export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
export interface TodoItemU {
  userId?: string
  todoId?: string
  createdAt?: string
  name?: string
  dueDate?: string
  done?: boolean
  attachmentUrl?: string
}
