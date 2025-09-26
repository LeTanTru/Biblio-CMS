import z from 'zod';

export const productVariantSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  imageUrl: z.string().nonempty('Bắt buộc'),
  condition: z.number(),
  format: z.number(),
  quantity: z
    .number({ error: 'Bắt buộc' })
    .positive('Số lượng phải lớn hơn không'),
  modifiedPrice: z.preprocess(
    (val) => (typeof val === 'string' ? Number(val) : val),
    z.number({ error: 'Bắt buộc' }).nonnegative('Giá không được là số âm')
  ),
  productId: z.string().nonempty('Bắt buộc').optional()
});

export const productVariantSearchSchema = z.object({
  condition: z.number().optional().nullable(),
  format: z.number().optional().nullable(),
  status: z.number().optional().nullable(),
  productId: z.union([z.string(), z.number()]).optional()
});
