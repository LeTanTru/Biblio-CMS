import z from 'zod';

export const categorySearchParamSchema = z.object({
  name: z.string().optional(),
  status: z.number()
});

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty('Bắt buộc'),
  description: z.string().nonempty('Bắt buộc'),
  ordering: z.number().optional(),
  status: z.number(),
  imageUrl: z.string()
});
