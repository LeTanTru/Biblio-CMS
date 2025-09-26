import z from 'zod';

export const productImageSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  url: z.string().nonempty('Bắt buộc'),
  isDefault: z.boolean(),
  productId: z.union([z.string(), z.number()]).optional()
});

export const productImageSearchSchema = z.object({
  productId: z.union([z.string(), z.number()]).optional()
});
