import { OpenAPIHono } from "@hono/zod-openapi"
import { SignSchema, SignParamsSchema, VerifySchema, VerifyParamsSchema } from "../models/minaModel"
import { createController } from "../utils"
import { sign, verify } from "../service/minaVerifyService"

const signResponses = [
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


const MinaSignController = createController('post', '/mina/sign', SignParamsSchema, signResponses)

const verifyResponses = [
  {
    statusCode: 200,
    content: {
      'application/json': {
        schema: VerifySchema,
      },
    },
    description: 'Retrieve the user',
  },
  {
    statusCode: 404,
    description: 'User not found',
  },
]

const MinaVerifyController = createController('post', '/mina/verify', VerifyParamsSchema, verifyResponses)
export default (app: OpenAPIHono) => {
  app.openapi(MinaSignController, (c: any) => {
    const { privKey, message } = c.req.valid('query') as any
    const result = sign('hello', privKey)
    return c.json({
      sign: result,
    })
  })

  app.openapi(MinaVerifyController, (c: any) => {
    const { data, signature, publicKey } = c.req.valid('query') as any
    const result = verify(data, signature, publicKey)
    return c.json({
      verify: result,
    })
  })
}
