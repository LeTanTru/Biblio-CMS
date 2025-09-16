import z from 'zod';

export const permissionSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty('Bắt buộc'),
  description: z.string().nonempty('Bắt buộc'),
  pCode: z.string().nonempty('Bắt buộc'),
  permissionGroupId: z.string().nonempty('Bắt buộc').optional()
});
