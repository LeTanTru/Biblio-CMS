import CategoryForm from '@/app/category/[id]/category-form';
import { queryKeys } from '@/constants';

export default function CategoryDetailPage() {
  return <CategoryForm queryKey={queryKeys.CATEGORY} />;
}
