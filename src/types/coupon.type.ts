import { couponSchema, couponSearchParamSchema } from '@/schemaValidations';
import { BaseSearchParamType } from '@/types/search.type';
import z from 'zod';

export type CouponResType = {
  id: string;
  code: string;
  kind: number;
  name: string;
  description: string;
  type: number;
  value: number;
  minOrderAmount: number;
  quantity: number;
  validFrom: Date;
  validTo: Date;
  status: number;
};

export type CouponBodyType = z.infer<typeof couponSchema>;

export type CouponSearchParamType = z.infer<typeof couponSearchParamSchema> &
  BaseSearchParamType;
