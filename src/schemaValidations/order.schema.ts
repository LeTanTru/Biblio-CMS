import z from 'zod';

export const orderSearchSchema = z.object({
  currentStatus: z.string().nullable().optional(),
  accountId: z.string().nullable().optional(),
  paymentMethod: z.string().nullable().optional()
});
