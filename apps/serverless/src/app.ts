import { OpenAPIHono } from '@hono/zod-openapi'
import { lobbyController, swaggerController, minaController } from './controllers'
import { cors } from 'hono/cors'

type Bindings = { doro: KVNamespace }

const app: any = new OpenAPIHono<{ Bindings: Bindings }>()

// serverless cors allow cross origin (only for testing)
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Origin'], // Include 'Access-Control-Allow-Methods' in allowHeaders
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  maxAge: 600,
  credentials: true,
}))

app.options('*', (c: any) => {
  return c.text('', 204)
})

lobbyController(app)
swaggerController(app)
minaController(app)

export default app
