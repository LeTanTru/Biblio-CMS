import { loginSchema } from '@/schemaValidations';
import z from 'zod';

export type LoginBodyType = z.infer<typeof loginSchema>;
export type LoginResType = {
  token: string;
};
