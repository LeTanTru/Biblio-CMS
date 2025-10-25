import { AccountResType } from '@/types/account.type';
import { AddressResType } from '@/types/address.type';
import { CouponResType } from '@/types/coupon.type';
import { OrderItemResType } from '@/types/order-item.type';
import { OrderStatusResType } from '@/types/order-status.type';
import { BaseSearchType } from '@/types/search.type';

export type OrderResType = {
  id: string;
  accountId: AccountResType;
  orderItems: OrderItemResType[];
  orderStatuses: OrderStatusResType[];
  currentStatus: number;
  paymentMethod: number;
  note: string;
  address: AddressResType;
  coupons: CouponResType[];
  deliveryFee: string;
  total: string;
  createdDate: string;
  modifiedDate: string;
  refundReason: string;
};

export type OrderStoreType = {
  addressId: string;
  paymentMethod: number;
  note: string;
  setAddressId: (addressId: string) => void;
  setPaymentMethod: (paymentMethod: number) => void;
  setNote: (note: string) => void;
};

export type OrderBodyType = {
  id: string;
  addressId: string;
  couponIds: string[];
  note: string;
  paymentMethod: number;
};

export type OrderSearchType = {
  currentStatus?: number | null;
  accountId?: number | null;
  paymentMethod?: number | null;
} & BaseSearchType;

export type UpdateStatusBodyType = {
  id: string;
  cmd: string;
};
