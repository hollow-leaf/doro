import { createRoute } from "@hono/zod-openapi";

export type ResponseType = {
  statusCode: number,
  content?: {
    'application/json': {
      schema: any,
    },
  },
  description: string,
}

export function createController(method: any, path: string, paramsSchema: any, responses: ResponseType[], requestBody?: any) {
  const responseObj: any = {};
  responses.forEach(response => {
    responseObj[response.statusCode] = {
      content: response.content,
      description: response.description,
    };
  });

  return (!requestBody)? createRoute({
    method: method,
    path: path,
    request: {
      params: paramsSchema,
    },
    responses: responseObj,
  }): createRoute({
    method: method,
    path: path,
    request: {
      params: paramsSchema,
      body: {
        content: {
          'application/json': {
            schema: requestBody,
          },
      },},
    },
      responses: responseObj,
      });
}