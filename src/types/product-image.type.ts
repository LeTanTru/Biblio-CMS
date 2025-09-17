import { productImageSearchParamSchema } from '@/schemaValidations';
import { BaseSearchParamType } from '@/types/search.type';
import z from 'zod';

export type ProductImageBodyType = z.infer<
  typeof productImageSearchParamSchema
>;
export type ProductImageSearchParamTYpe = z.infer<
  typeof productImageSearchParamSchema
> &
  BaseSearchParamType;

export type ProductImageResType = {
  id: string;
  url: string;
  ordering: number;
  isDefault: boolean;
  productId: bigint;
  createdDate: Date;
  modifiedDate: Date;
};
