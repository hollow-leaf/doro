import { z } from 'zod'
import { createParamSchema, createSchema } from '../utils';

export const SignParamsSchema = z.object({
  privKey: createParamSchema('privKey', 'string', 0),
  message: createParamSchema('message', 'string', 0),
});

export const SignSchema = createSchema('sign', {
  sign: { type: 'string', example: '123' },
});

export const VerifyParamsSchema = z.object({
  data: createParamSchema('data', 'string', 0),
  signature: createParamSchema('signature', 'string', 0),
  publicKey: createParamSchema('publicKey', 'string', 0),
});

export const VerifySchema = createSchema('verify', {
  verify: { type: 'boolean', example: 'true' },
});