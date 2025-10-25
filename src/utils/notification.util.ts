import { NOTIFICATION_TYPE_ORDER } from '@/constants';

export const generateNotificationTemplate = (type: number) => {
  switch (type) {
    case NOTIFICATION_TYPE_ORDER: {
      return 'Bạn có đơn hàng mới';
    }
  }
  return 'Thông báo';
};
