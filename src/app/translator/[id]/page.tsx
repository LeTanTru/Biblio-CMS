import TranslatorForm from '@/app/translator/[id]/translator-form';
import { queryKeys } from '@/constants';

export default async function TranslatorDetailPage() {
  return <TranslatorForm queryKey={queryKeys.TRANSLATOR} />;
}
