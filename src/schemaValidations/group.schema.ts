import z from 'zod';

export const groupSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty('Bắt buộc'),
  description: z.string().nonempty('Bắt buộc'),
  kind: z.number().optional(),
  permissionIds: z.string().array()
});
