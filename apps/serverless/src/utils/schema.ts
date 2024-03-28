import z from 'zod'

export function createSchema(name: string, fields: { [key: string]: { type: 'string' | 'number' | 'boolean', example: string | number } }) {
  const schema: { [key: string]: z.ZodTypeAny } = {}; // Fix: Specify the type of 'schema' variable
  for (const field in fields) {
    schema[field] = z[fields[field].type]().openapi({
      example: fields[field].example,
    });
  }
  return z.object(schema).openapi(name);
}

export function createParamSchema(name: string, type: 'string' | 'number' , minLength?: number, apiLoc = 'path') {
  let schema = z[type]();
  if (type === 'string' && minLength) {
    schema = schema.min(minLength);
  }
  const example = type === 'string' ? 'example' : 123;
  return schema.openapi({
    param: {
      name: name,
      in: apiLoc as 'path' | 'query' | 'header' | 'cookie',
    },
    example: example,
  });
}