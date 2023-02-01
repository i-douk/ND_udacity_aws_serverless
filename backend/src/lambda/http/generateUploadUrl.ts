import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { generateUploadUrl } from '../../businessLogic/todos'


const logger = createLogger('generateUploadUrl')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing generateUploadUrl event', { event })
  const todoId = event.pathParameters.todoId
  const url = await generateUploadUrl(todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl : url
    })
  }}
)


handler.use(
  cors({
    credentials: true
  })
)