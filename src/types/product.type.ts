import { productSchema, productSearchParamSchema } from '@/schemaValidations';
import { BaseSearchParamType } from '@/types/search.type';
import z from 'zod';

export type ProductBodyType = z.infer<typeof productSchema>;
export type ProductSearchParamTYpe = z.infer<typeof productSearchParamSchema> &
  BaseSearchParamType;

export type ProductResType = {
  name: '';
};
