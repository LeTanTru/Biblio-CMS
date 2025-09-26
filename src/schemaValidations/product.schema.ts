import { ageRatings } from '@/constants';
import z from 'zod';

const validAgeRatings = ageRatings.map((age) => age.value);

export const productSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().nonempty('Bắt buộc'),
  description: z.string().nonempty('Bắt buộc'),
  price: z.preprocess(
    (val) => (typeof val === 'string' ? Number(val) : val),
    z.number({ error: 'Bắt buộc' }).nonnegative('Giá không được là số âm')
  ),
  releaseDate: z.preprocess((val) => {
    if (val instanceof Date) {
      return val.toISOString();
    }
    return val;
  }, z.string().nonempty('Bắt buộc')),
  ageRating: z
    .number({ error: 'Bắt buộc' })
    .refine((val) => validAgeRatings.includes(val), {
      message: 'Độ tuổi không hợp lệ'
    }),
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
  contributorIds: z.array(z.string()).optional(),
  publisherId: z.string().nonempty('Bắt buộc'),
  metaData: z.object({
    height: z
      .number({ error: 'Bắt buộc' })
      .positive('Chiều cao phải lớn hơn 0'),
    width: z
      .number({ error: 'Bắt buộc' })
      .positive('Chiều rộng phải lớn hơn 0'),
    length: z
      .number({ error: 'Bắt buộc' })
      .positive('Chiều dài phải lớn hơn 0'),
    weight: z.number({ error: 'Bắt buộc' }).positive('Cân nặng phải lớn hơn 0'),
    numPage: z
      .number({ error: 'Bắt buộc' })
      .positive('Số trang phải lớn hơn 0')
      .int({ error: 'Số trang phải là số nguyên' })
  }),
  authorIds: z.array(z.string()).nonempty('Bắt buộc').optional(),
  translatorIds: z.array(z.string()).optional()
});

export const productSearchSchema = z.object({
  name: z.string().optional().nullable(),
  ageRating: z.number().optional().nullable(),
  language: z.string().optional().nullable(),
  isFeatured: z.number().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  publisherId: z.string().optional().nullable(),
  status: z.number().optional().nullable()
});
