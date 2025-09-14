import { authorSchema, authorSchemaParamSchema } from '@/schemaValidations';
import { BaseSearchParamType } from '@/types/search.type';
import z from 'zod';

export type AuthorResType = {
  id: string;
  name: string;
  bio: string;
  avatarPath: string;
  kind: number;
  gender: number;
  dateOfBirth: Date;
  country: string;
  createdDate: Date;
  modifiedDate: Date;
  status: number;
};

export type AuthorBodyType = z.infer<typeof authorSchema>;

export type AuthorSearchParamType = z.infer<typeof authorSchemaParamSchema> &
  BaseSearchParamType;
