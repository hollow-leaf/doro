// lobby function
import { OpenAPIHono, createRoute } from "@hono/zod-openapi"
import { UserSchema, ParamsSchema } from "../models/userModel"
import { createController, ResponseType } from "../utils"

const responses: ResponseType[] = [
  {
    statusCode: 200,
    content: {
      'application/json': {
        schema: UserSchema,
      },
    },
    description: 'Retrieve the user',
  },
  {
    statusCode: 404,
    description: 'User not found',
  },
];

const UserController = createController('get', '/users/{id}', ParamsSchema, responses)

export default (app: OpenAPIHono) => {
  // path: /users/{id}
  app.openapi(UserController, (c: any) => {
    const { id } = c.req.valid('param') as any
    return c.json({
      id,
      age: 20,
      name: 'Ultra-man',
      d: 'a'
    })
  })
}