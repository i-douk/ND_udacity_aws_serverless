import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from 'middy'
import { cors } from 'middy/middlewares'
import 'source-map-support/register'
import { deleteTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('deleteTodo')

export const handler = middy (async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  await deleteTodo(userId, todoId)
  return {
    statusCode: 200,
    body: ''
  }
})

handler.use(
  cors({
    credentials: true
  })
)

