import AuthorForm from '@/app/author/[id]/author-form';
import { PageWrapper } from '@/components/layout';
import route from '@/routes';

export default async function AuthorDetailPage({
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
        { label: 'Tác giả', href: route.author.getList.path },
        { label: `${isCreate ? 'Thêm mới' : 'Cập nhật'} tác giả` }
      ]}
    >
      <AuthorForm queryKey='author' />
    </PageWrapper>
  );
}
