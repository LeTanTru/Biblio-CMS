import ProfileForm from '@/app/profile/profile-form';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import route from '@/routes';

export default function ProfilePage() {
  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Trang chủ', href: route.home.path },
        { label: 'Hồ sơ' }
      ]}
    >
      <ListPageWrapper>
        <ProfileForm />
      </ListPageWrapper>
    </PageWrapper>
  );
}
