import {
  publisherSchema,
  publisherSearchParamSchema
} from '@/schemaValidations';
import { BaseSearchParamType } from '@/types/search.type';
import z from 'zod';

export type PublisherBodyType = z.infer<typeof publisherSchema>;
export type PublisherSearchParamTYpe = z.infer<
  typeof publisherSearchParamSchema
> &
  BaseSearchParamType;

export type PublisherResType = {
  id: string;
  name: string;
  description: string;
  logoPath: string;
  createdDate: Date;
  modifiedDate: Date;
  status: number;
};
