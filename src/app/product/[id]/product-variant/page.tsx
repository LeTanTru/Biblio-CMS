import ProductVariantList from '@/app/product/_components/product-variant-list';
import { queryKeys } from '@/constants';

export default function ProductVariantPage() {
  return <ProductVariantList queryKey={queryKeys.PRODUCT_VARIANT} />;
}
