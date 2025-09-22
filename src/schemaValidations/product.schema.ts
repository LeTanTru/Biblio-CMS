import z from 'zod';

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty('Bắt buộc'),
  description: z.string().nonempty('Bắt buộc'),
  price: z.number({ error: 'Bắt buộc' }).nonnegative('Giá không được là số âm'),
  releaseDate: z.string().nonempty('Bắt buộc'),
  ageRating: z.number({ error: 'Bắt buộc' }),
  language: z.string().nonempty('Bắt buộc'),
  isFeatured: z.boolean({ error: 'Bắt buộc' }),
  discount: z
    .number({ error: 'Bắt buộc' })
    .nonnegative('Giảm giá không được là số âm')
    .min(0, {
      error: 'Giảm giá phải lớn hơn 0'
    })
    .max(100, { error: 'Giảm giá phải nhỏ hơn 100' }),
  categoryId: z.string().nonempty('Bắt buộc'),
  contributorsIds: z.array(z.string()).nonempty('Bắt buộc'),
  publisherId: z.string().nonempty('Bắt buộc'),
  metaData: z.object({
    height: z
      .number({ error: 'Bắt buộc' })
      .nonnegative('Chiều cao không được âm'),
    width: z
      .number({ error: 'Bắt buộc' })
      .nonnegative('Chiều rộng không được âm'),
    length: z
      .number({ error: 'Bắt buộc' })
      .nonnegative('Chiều dài không được âm'),
    weight: z
      .number({ error: 'Bắt buộc' })
      .nonnegative('Cân nặng không được âm'),
    numPage: z
      .number({ error: 'Bắt buộc' })
      .positive('Số trang phải lớn hơn 0')
      .int({ error: 'Số trang phải là số nguyên' })
  })
});

export const productSearchParamSchema = z.object({
  name: z.string().optional().nullable(),
  ageRating: z.number().optional().nullable(),
  language: z.string().optional().nullable(),
  isFeatured: z.boolean().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  publisherId: z.string().optional().nullable(),
  status: z.number().optional().nullable()
});
