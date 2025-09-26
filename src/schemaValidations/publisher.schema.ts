import z from 'zod';

export const publisherSchema = z.object({
  name: z.string().nonempty('Bắt buộc'),
  description: z.string().nonempty('Bắt buộc'),
  logoPath: z.string().nonempty('Bắt buộc')
});

export const publisherSearchSchema = z.object({
  name: z.string().optional(),
  status: z.number().optional()
});
