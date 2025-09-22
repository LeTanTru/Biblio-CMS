import z from 'zod';

export const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().nonempty('Bắt buộc'),
  isDefault: z.boolean(),
  productId: z.string()
});

export const productImageSearchParamSchema = z.object({
  productId: z.string()
});
