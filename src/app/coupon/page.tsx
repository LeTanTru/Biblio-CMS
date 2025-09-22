import CouponList from '@/app/coupon/_components/coupon-list';
import { queryKeys } from '@/constants';

export default function CouponPage() {
  return <CouponList queryKey={queryKeys.COUPON} />;
}
