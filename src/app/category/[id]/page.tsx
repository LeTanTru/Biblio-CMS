import CategoryForm from '@/app/category/[id]/category-form';
import { PageWrapper } from '@/components/layout';
import route from '@/routes';

export default async function CategoryDetailPage({
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
        { label: 'Danh mục', href: route.category.getList.path },
        { label: `${isCreate ? 'Thêm mới' : 'Chỉnh sửa'} danh mục` }
      ]}
    >
      <CategoryForm />
    </PageWrapper>
  );
}
