import { z } from 'zod'
import { createParamSchema, createSchema } from '../utils';

export const gameSchema = createSchema('User', {
  id: { type: 'string', example: '123' },
});

export const bodySchema = z.object({
  data: z.string(),
});