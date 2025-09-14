import z from 'zod';

export const authorSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().nonempty('Bắt buộc'),
  bio: z.string().nonempty('Bắt buộc'),
  avatarPath: z.string(),
  gender: z.number(),
  dateOfBirth: z.preprocess((val) => {
    if (val instanceof Date) {
      return val.toLocaleDateString();
    }
    return val;
  }, z.string('Bắt buộc')),
  country: z.string()
});

export const authorSchemaParamSchema = z.object({
  name: z.string().optional(),
  kind: z.number().optional().nullable()
});
