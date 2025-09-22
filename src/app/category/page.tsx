import CategoryList from '@/app/category/_components/category-list';
import { queryKeys } from '@/constants';

export default function CategoryPage() {
  return <CategoryList queryKey={queryKeys.CATEGORY} />;
}
