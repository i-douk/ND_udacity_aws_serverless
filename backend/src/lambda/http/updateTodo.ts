import 'source-map-support/register'
import { APIGatewayProxyEvent } from 'aws-lambda'
import middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateTodo } from '../../helpers/todos'
import { getUserId } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent) => {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  const userId = getUserId(event)
  const newItem = { todoId, userId, ...updatedTodo, createdAt: new Date().toISOString() }
  await updateTodo(todoId, newItem, userId)
  return { statusCode: 204, body: '' }
})

handler
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
