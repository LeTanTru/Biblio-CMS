import ProfileForm from '@/app/profile/profile-form';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';

export default function ProfilePage() {
  return (
    <PageWrapper breadcrumbs={[{ label: 'Hồ sơ' }]}>
      <ListPageWrapper>
        <ProfileForm />
      </ListPageWrapper>
    </PageWrapper>
  );
}
