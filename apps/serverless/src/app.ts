import { OpenAPIHono } from '@hono/zod-openapi'
import { lobbyController, swaggerController, minaController } from './controllers'
import { cors } from 'hono/cors'

type Bindings = { "doro-": KVNamespace }

const app = new OpenAPIHono<{ Bindings: Bindings }>()

lobbyController(app)
swaggerController(app)
minaController(app)

export default app
