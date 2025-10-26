import EmployeeForm from '@/app/account/[id]/employee-form';
import { queryKeys } from '@/constants';

export default async function EmployeeDetailPage() {
  return <EmployeeForm queryKey={queryKeys.AUTHOR} />;
}
