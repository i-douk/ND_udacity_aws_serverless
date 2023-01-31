import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from 'middy'
import { cors } from 'middy/middlewares'
import 'source-map-support/register'
import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

// const logger = createLogger('updatedTodo')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // logger.info('Processing event: ', event)
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  
    try {
      await updateTodo(userId, todoId, updatedTodo)
  
      return {
        statusCode: 201,
        body: ''
      }
    } catch (error) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error
        })
      }
    }}
)

handler.use(
  cors({
    credentials: true
  })
)
