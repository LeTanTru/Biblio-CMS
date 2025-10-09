import { ProductVariantResType } from '@/types/product-variant.type';

export type OrderItemResType = {
  id: string;
  orderId: string;
  productVariant: ProductVariantResType;
  quantity: number;
  price: string;
  discount: number;
  total: string;
};
