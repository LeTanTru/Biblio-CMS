import PublisherForm from '@/app/publisher/[id]/publisher-form';
import { queryKeys } from '@/constants';

export default async function PublisherDetailPage() {
  return <PublisherForm queryKey={queryKeys.PUBLISHER} />;
}
