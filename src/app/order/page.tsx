import { OrderList } from '@/app/order/_components';
import { queryKeys } from '@/constants';
import React from 'react';

export default function OrderPage() {
  return <OrderList queryKey={queryKeys.ORDER} />;
}
