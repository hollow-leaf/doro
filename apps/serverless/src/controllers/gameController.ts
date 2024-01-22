import { OpenAPIHono } from "@hono/zod-openapi";

import { createController, ResponseType } from "../utils";
import { GameSchema, GameParamsSchema } from "../models/gameModel";

const responses: ResponseType[] = [
  {
    statusCode: 200,
    content: {
      'application/json': {
        schema: GameSchema,
      },
    },
    description: 'Retrieve the user',
  },
  {
    statusCode: 404,
    description: 'User not found',
  },
]

const GameController = createController('get', '/latest_game/:id', GameParamsSchema, responses)

const AnswerController = createController('get', '/get_answer/:id', GameParamsSchema, responses)

export default (app: OpenAPIHono) => {
  // path: /latest_game
  app.openapi(GameController, (c: any) => {
    const { id } = c.req.valid('param') as any
    return c.json({
      id,
      age: 20,
      name: 'Ultra-man',
      d: 'a'
    })
  })

  // path: /get_answer
  app.openapi(AnswerController, (c: any) => {
    const { id } = c.req.valid('param') as any
    return c.json({
      id,
    })
  })
}