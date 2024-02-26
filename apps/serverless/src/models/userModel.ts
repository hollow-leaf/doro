import { z } from 'zod'
import { createParamSchema, createSchema } from '../utils';

type Binding = {
  "mina-doro": KVNamespace
}
export const ParamsSchema = z.object({
  id: createParamSchema('id', 'string', 2),
});

export const UserSchema = createSchema('User', {
  id: { type: 'string', example: '123' },
  name: { type: 'string', example: 'John Doe' },
  age: { type: 'number', example: 42 },
});