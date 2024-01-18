import { OpenAPIHono } from '@hono/zod-openapi'

const app = new OpenAPIHono()

// route use zod to validate request
// https://hono.dev/snippets/zod-openapi

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello/:name', (c) => {
  return c.text(`Hello!`)
})

export default app
