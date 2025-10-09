import {
  productVariantSchema,
  productVariantSearchSchema
} from '@/schemaValidations';
import { ProductResType } from '@/types/product.type';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type ProductVariantBodyType = z.infer<typeof productVariantSchema>;
export type ProductVariantSearchType = z.infer<
  typeof productVariantSearchSchema
> &
  BaseSearchType;

export type ProductVariantResType = {
  id: string;
  condition: number;
  format: number;
  quantity: number;
  modifiedPrice: number;
  imageUrl: string;
  product: ProductResType;
  createdDate: string;
  modifiedDate: string;
  status: number;
};
