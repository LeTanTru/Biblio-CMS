import TranslatorForm from '@/app/translator/[id]/translator-form';
import { PageWrapper } from '@/components/layout';
import { queryKeys } from '@/constants';
import route from '@/routes';

export default async function TranslatorDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isCreate = id === 'create';
  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Dịch giả', href: route.translator.getList.path },
        { label: `${isCreate ? 'Thêm mới' : 'Cập nhật'} dịch giả` }
      ]}
    >
      <TranslatorForm queryKey={queryKeys.TRANSLATOR} />
    </PageWrapper>
  );
}
