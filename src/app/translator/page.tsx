import TranslatorList from '@/app/translator/_components/translator-list';
import { queryKeys } from '@/constants';

export default function TranslatorPage() {
  return <TranslatorList queryKey={queryKeys.TRANSLATOR} />;
}
