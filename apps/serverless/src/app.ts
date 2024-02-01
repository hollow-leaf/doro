import { OpenAPIHono } from '@hono/zod-openapi'
import { lobbyController, swaggerController, minaController } from './controllers'

const app = new OpenAPIHono()

lobbyController(app)
swaggerController(app)
minaController(app)
export default app
