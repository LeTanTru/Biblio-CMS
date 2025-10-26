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
  email: z.string().optional().nullable(),
  fullName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  kind: z.number().optional().nullable(),
  isSuperAdmin: z.boolean().optional().nullable()
});

export const accountSchema = z.object({
  email: z.string().nonempty('Bắt buộc'),
  password: z
    .string()
    .nonempty('Bắt buộc')
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số')
    .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
  fullName: z.string().nonempty('Bắt buộc'),
  avatarPath: z.string().optional(),
  phone: z
    .string({ error: 'Số điện thoại không được để trống' })
    .trim()
    .regex(/^\d{10}$/, 'Số điện thoại không hợp lệ'),
  groupId: z.string().nonempty('Bắt buộc')
});
