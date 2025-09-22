import GroupForm from '@/app/group-permission/[id]/group-form';
import { PageWrapper } from '@/components/layout';
import route from '@/routes';

export default async function GroupDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isCreate = id === 'create';
  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Nhóm quyền', href: route.group.getList.path },
        { label: `${isCreate ? 'Thêm mới' : 'Cập nhật'} quyền` }
      ]}
    >
      <GroupForm />
    </PageWrapper>
  );
}
