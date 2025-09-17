import ProductForm from '@/app/product/[id]/product-form';
import { PageWrapper } from '@/components/layout';
import route from '@/routes';

export default async function ProductDetailPage({
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
        { label: 'Danh mục', href: route.product.getList.path },
        { label: `${isCreate ? 'Thêm mới' : 'Cập nhật'} sản phẩm` }
      ]}
    >
      <ProductForm queryKey='product' />
    </PageWrapper>
  );
}
