import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import route from '@/routes';

export default function ProductPage() {
  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Trang chủ', href: route.home.path },
        { label: 'Sách' }
      ]}
    >
      <ListPageWrapper></ListPageWrapper>
    </PageWrapper>
  );
}
