import {
  productVariantSchema,
  productVariantSearchParamSchema
} from '@/schemaValidations';
import { BaseSearchParamType } from '@/types/search.type';
import z from 'zod';

export type ProductVariantBodyType = z.infer<typeof productVariantSchema>;
export type ProductVariantSearchParamTYpe = z.infer<
  typeof productVariantSearchParamSchema
> &
  BaseSearchParamType;

export type ProductVariantResType = {
  name: '';
};
