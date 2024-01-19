import { OpenAPIHono } from '@hono/zod-openapi'
import { lobbyController, swaggerController } from './controllers'

const app = new OpenAPIHono()

lobbyController(app)
swaggerController(app)

export default app
