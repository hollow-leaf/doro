import { z } from 'zod';
import { createParamSchema, createSchema } from '../utils';

export const GameParamsSchema = z.object({
  privKey: createParamSchema('privKey', 'string', 0),
  message: createParamSchema('message', 'string', 0),
});

export const GameSchema = createSchema('sign', {
  sign: { type: 'string', example: '123' },
});