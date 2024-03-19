// lobby function
import { OpenAPIHono, createRoute } from "@hono/zod-openapi"
import { gameSchema, bodySchema } from "../models/gameModel"
import { createController, ResponseType } from "../utils"

const responses: ResponseType[] = [
  {
    statusCode: 200,
    content: {
      'application/json': {
        schema: gameSchema,
      },
    },
    description: 'Retrieve the user',
  },
  {
    statusCode: 404,
    description: 'User not found',
  },
];

const UserController = createController('post', '/game/{id}', gameSchema, responses, bodySchema)

export default (app: OpenAPIHono) => {
  // path: /game/{id}
  app.openapi(UserController, async (c: any) => {
    const { id } = c.req.valid('param') as any
    const { data } = c.req.valid('json') as any
    await c.env.doro?.put(`game-${id}`, data)
   
    return c.json({
      id
    })
  })
}