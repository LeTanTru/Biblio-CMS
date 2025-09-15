import PublisherForm from '@/app/publisher/[id]/publisher-form';
import { PageWrapper } from '@/components/layout';
import route from '@/routes';

export default async function PublisherDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isCreate = id === 'create';
  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Trang chủ', href: route.home.path },
        { label: 'Nhà xuất bản', href: route.publisher.getList.path },
        { label: `${isCreate ? 'Thêm mới' : 'Cập nhật'} nhà xuất bản` }
      ]}
    >
      <PublisherForm queryKey='publisher' />
    </PageWrapper>
  );
}
