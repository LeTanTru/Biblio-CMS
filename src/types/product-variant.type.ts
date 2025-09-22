import {
  productVariantSchema,
  productVariantSearchParamSchema
} from '@/schemaValidations';
import { BaseSearchParamType } from '@/types/search.type';
import z from 'zod';

export type ProductVariantBodyType = z.infer<typeof productVariantSchema>;
export type ProductVariantSearchParamType = z.infer<
  typeof productVariantSearchParamSchema
> &
  BaseSearchParamType;

export type ProductVariantResType = {
  id: string;
  condition: number;
  format: number;
  quantity: number;
  modifiedPrice: number;
  imageUrl: string;
  productId: string;
  status: number;
};
