import z from 'zod';

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty('Bắt buộc'),
  description: z.string().nonempty('Bắt buộc'),
  price: z.number({ error: 'Bắt buộc' }),
  releaseDate: z.string().nonempty('Bắt buộc'),
  ageRating: z.number({ error: 'Bắt buộc' }),
  language: z.string().nonempty('Bắt buộc'),
  isFeatured: z.boolean({ error: 'Bắt buộc' }),
  metaData: z.string().nonempty('Bắt buộc'),
  discount: z.number('Bắt buộc'),
  category: z.string().nonempty('Bắt buộc'),
  contributorsIds: z.array(z.string()).nonempty('Bắt buộc')
});

export const productSearchParamSchema = z.object({
  name: z.string().optional(),
  ageRating: z.number().optional(),
  language: z.string().optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.string().optional(),
  publisherId: z.string().optional()
});
