import z from 'zod';

export const baseSearchParamSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional()
});
