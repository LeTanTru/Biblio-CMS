import z from 'zod';

export const orderSearchSchema = z.object({
  currentStatus: z.number().nullable(),
  accountId: z.number().nullable(),
  paymentMethod: z.number().nullable()
});
