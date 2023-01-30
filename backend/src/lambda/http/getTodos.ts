import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import middy from 'middy'
import { cors } from 'middy/middlewares'
// import { getUserId } from '../utils';
import { getTodos } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
// TODO: Implement creating a new TODO item
const logger = createLogger('getTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('getTodos event', { event })

    const userId = event.requestContext.authorizer.principalId

    const res = await getTodos(userId)

      const statusCode = 200
      const body = JSON.stringify({ items: res })
    
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body
    }
  }
)

 
handler.use(
  cors({
    credentials: true
  })
)