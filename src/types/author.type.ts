import { authorSchema, authorSearchSchema } from '@/schemaValidations';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type AuthorResType = {
  id: string;
  name: string;
  bio: string;
  avatarPath: string;
  kind: number;
  gender: number;
  dateOfBirth: string;
  country: string;
  createdDate: Date;
  modifiedDate: Date;
  status: number;
};

export type AuthorBodyType = z.infer<typeof authorSchema>;

export type AuthorSearchType = z.infer<typeof authorSearchSchema> &
  BaseSearchType;
