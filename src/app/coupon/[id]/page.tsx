import CouponForm from '@/app/coupon/[id]/coupon-form';
import { PageWrapper } from '@/components/layout';
import { queryKeys } from '@/constants';
import route from '@/routes';

export default async function CouponDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isCreate = id === 'create';
  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Khuyến mãi', href: route.author.getList.path },
        { label: `${isCreate ? 'Thêm mới' : 'Cập nhật'} khuyến mãi` }
      ]}
    >
      <CouponForm queryKey={queryKeys.AUTHOR} />
    </PageWrapper>
  );
}
