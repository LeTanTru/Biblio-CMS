import z from 'zod';

export const baseSearchParamSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional()
});

export const groupSearchParamSchema = z.object({
  name: z.string().optional(),
  kind: z.union([z.number(), z.string()]).optional(),
  isSystemRole: z.boolean().optional()
});
