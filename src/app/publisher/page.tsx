import PublisherList from '@/app/publisher/_components/publisher-list';
import { queryKeys } from '@/constants';

export default function PublisherPage() {
  return <PublisherList queryKey={queryKeys.PUBLISHER} />;
}
