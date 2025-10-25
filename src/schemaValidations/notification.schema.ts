import z from 'zod';

export const notificationSchema = z.object({
  type: z.number().nullable(),
  account: z.string().nullable(),
  seen: z.boolean()
});
