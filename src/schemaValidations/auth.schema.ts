import z from 'zod';

export const loginSchema = z.object({
  email: z.string().nonempty('Bắt buộc'),
  password: z.string().nonempty('Bắt buộc')
});
