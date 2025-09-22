import ProductForm from '@/app/product/[id]/product-form';
import { queryKeys } from '@/constants';

export default async function ProductDetailPage() {
  return <ProductForm queryKey={queryKeys.PRODUCT} />;
}
