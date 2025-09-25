import { z } from 'zod';

export const couponSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  code: z.string().nonempty('Bắt buộc'),
  kind: z.number({ error: 'Bắt buộc' }),
  name: z.string().nonempty('Bắt buộc'),
  description: z.string().nonempty('Bắt buộc'),
  type: z.number({ error: 'Bắt buộc' }),
  value: z.preprocess((v) => Number(v), z.number({ error: 'Bắt buộc' })),
  minOrderAmount: z.preprocess(
    (v) => Number(v),
    z.number({ error: 'Bắt buộc' })
  ),
  quantity: z.number({ error: 'Bắt buộc' }),
  validFrom: z.preprocess((v) => new Date(v as string), z.date()),
  validTo: z.preprocess((v) => new Date(v as string), z.date())
});

export const couponSearchParamSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  kind: z.number().optional().nullable(),
  type: z.number().optional().nullable(),
  status: z.number().optional().nullable()
});
