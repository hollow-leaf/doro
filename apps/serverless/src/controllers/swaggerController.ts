import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono }from '@hono/zod-openapi'

export default (app: OpenAPIHono) => {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: '0.2.0',
      title: 'Doro API',
    },
  })
  app.get('/ui', swaggerUI({ url: '/doc' }))
}