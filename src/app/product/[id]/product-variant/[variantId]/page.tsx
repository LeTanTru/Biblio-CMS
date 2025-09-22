import ProductVariantForm from '@/app/product/[id]/product-variant/[variantId]/product-variant-form';
import { queryKeys } from '@/constants';

export default function ProductVariantSavePage() {
  return <ProductVariantForm queryKey={queryKeys.PRODUCT_VARIANT} />;
}
