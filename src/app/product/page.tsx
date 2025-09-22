import ProductList from '@/app/product/_components/product-list';
import { queryKeys } from '@/constants';

export default function ProductPage() {
  return <ProductList queryKey={queryKeys.PRODUCT} />;
}
