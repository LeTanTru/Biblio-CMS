import NotificationList from '@/app/notification/_components/notification-list';
import { queryKeys } from '@/constants';

export default function NotificationPage() {
  return <NotificationList queryKey={queryKeys.NOTIFICATION} />;
}
