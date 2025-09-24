import AuthorForm from '@/app/author/[id]/author-form';
import { queryKeys } from '@/constants';

export default async function AuthorDetailPage() {
  return <AuthorForm queryKey={queryKeys.AUTHOR} />;
}
