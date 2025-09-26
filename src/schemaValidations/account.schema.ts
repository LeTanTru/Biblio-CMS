import z from 'zod';

export const updateProfileSchema = z.object({
  email: z.string().nonempty('Bắt buộc').email('Email không đúng định dạng'),
  fullName: z.string().nonempty('Bắt buộc'),
  avatarPath: z.string().optional(),
  phone: z
    .string()
    .regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ')
    .optional()
});

export const accountSearchSchema = z.object({
  email: z.string().optional(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  kind: z.number().optional(),
  isSuperAdmin: z.boolean().optional()
});
