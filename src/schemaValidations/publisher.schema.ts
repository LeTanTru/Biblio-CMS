import z from 'zod';

export const publisherSchema = z.object({
  name: z.string().nonempty('Bắt buộc'),
  description: z.string().nonempty('Bắt buộc'),
  logoPath: z.string().nonempty('Bắt buộc')
});

export const publisherSearchParamSchema = z.object({
  name: z.string().optional()
});
