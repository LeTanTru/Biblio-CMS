import { categorySchema, categorySearchSchema } from '@/schemaValidations';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type CategoryResType = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  ordering: number;
  status: number;
  createdDate: Date;
  modifiedDate: Date;
};

export type CategoryBodyType = z.infer<typeof categorySchema>;

export type CategorySearchType = z.infer<typeof categorySearchSchema> &
  BaseSearchType;

export type CategoryAutoResType = {
  id: string;
  name: string;
  slug: string;
};
