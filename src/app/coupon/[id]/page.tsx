import CouponForm from '@/app/coupon/[id]/coupon-form';
import { queryKeys } from '@/constants';

export default async function CouponDetailPage() {
  return <CouponForm queryKey={queryKeys.AUTHOR} />;
}
