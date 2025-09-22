import AuthorList from '@/app/author/_components/author-list';
import { queryKeys } from '@/constants';

export default function AuthorPage() {
  return <AuthorList queryKey={queryKeys.AUTHOR} />;
}
