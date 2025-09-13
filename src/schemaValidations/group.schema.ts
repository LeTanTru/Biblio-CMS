import z from 'zod';

export const groupSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().nonempty('Bắt buộc'),
  description: z.string().nonempty('Bắt buộc'),
  kind: z.number().optional(),
  permissionIds: z.string().array()
});
