'use client';
import { apiConfig } from '@/constants';
import { useSaveBase } from '@/hooks';
import route from '@/routes';
import { CouponBodyType, CouponResType } from '@/types/coupon.type';

export default function CouponForm({ queryKey }: { queryKey: string }) {
  const { data, loading, handleSubmit, renderActions } = useSaveBase<
    CouponResType,
    CouponBodyType
  >({
    apiConfig: apiConfig.coupon,
    options: {
      queryKey,
      objectName: 'tác giả',
      listPageUrl: route.coupon.getList.path
    }
  });
  const defaultValues: CouponBodyType = {
    code: '',
    description: '',
    kind: 0,
    minOrderAmount: 0,
    name: '',
    quantity: 0,
    type: 0,
    validFrom: '',
    validTo: '',
    value: 0
  };

  return <div></div>;
}
