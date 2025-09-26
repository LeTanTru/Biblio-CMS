import {
  productImageSchema,
  productImageSearchSchema
} from '@/schemaValidations';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type ProductImageBodyType = z.infer<typeof productImageSchema>;
export type ProductImageSearchType = z.infer<typeof productImageSearchSchema> &
  BaseSearchType;

export type ProductImageResType = {
  id: string;
  url: string;
  ordering: number;
  isDefault: boolean;
  productId: bigint;
  createdDate: Date;
  modifiedDate: Date;
};
