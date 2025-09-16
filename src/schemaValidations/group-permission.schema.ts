import z from 'zod';

export const groupPermissionSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty('Bắt buộc')
});
