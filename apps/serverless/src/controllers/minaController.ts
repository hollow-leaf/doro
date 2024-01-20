import { OpenAPIHono } from "@hono/zod-openapi"
import { SignSchema, SignParamsSchema } from "../models/minaModel"
import { createController } from "../utils"
import { sign } from "../service/minaVerifyService"

const responses = [
  {
    statusCode: 200,
    content: {
      'application/json': {
        schema: SignSchema,
      },
    },
    description: 'Retrieve the user',
  },
  {
    statusCode: 404,
    description: 'User not found',
  },
]


const MinaController = createController('post', '/mina/sign', SignParamsSchema, responses)

export default (app: OpenAPIHono) => {
  app.openapi(MinaController, (c: any) => {
    const { privKey, message } = c.req.valid('query') as any
    const result = sign('hello', privKey)
    return c.json({
      sign: result,
    })
  })
}
