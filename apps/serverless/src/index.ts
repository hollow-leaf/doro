import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello/:name', (c: any) => {
  return c.text(`Hello ${c.params.name}!`)
})

export default app
