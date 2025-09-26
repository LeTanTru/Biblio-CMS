import { publisherSchema, publisherSearchSchema } from '@/schemaValidations';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type PublisherBodyType = z.infer<typeof publisherSchema>;
export type PublisherSearchType = z.infer<typeof publisherSearchSchema> &
  BaseSearchType;

export type PublisherResType = {
  id: string;
  name: string;
  description: string;
  logoPath: string;
  createdDate: Date;
  modifiedDate: Date;
  status: number;
};
