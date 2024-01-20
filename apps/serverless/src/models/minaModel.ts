import { z } from 'zod'
import { createParamSchema, createSchema } from '../utils';

export const SignParamsSchema = z.object({
  privKey: createParamSchema('privKey', 'string', 0),
  message: createParamSchema('message', 'string', 0),
});

export const SignSchema = createSchema('sign', {
  sign: { type: 'string', example: '123' },
});