import { z } from 'zod';

export const couponSchema = z.object({
  id: z.string().optional(),
  code: z.string().nonempty('Bắt buộc'),
  kind: z.number(),
  name: z.string().nonempty('Bắt buộc'),
  description: z.string().nonempty('Bắt buộc'),
  type: z.number(),
  value: z.number(),
  minOrderAmount: z.number(),
  quantity: z.number(),
  validFrom: z.string().nonempty('Bắt buộc'),
  validTo: z.string().nonempty('Bắt buộc')
});

export const couponSearchParamSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  kind: z.number().optional().nullable(),
  type: z.number().optional().nullable()
});
