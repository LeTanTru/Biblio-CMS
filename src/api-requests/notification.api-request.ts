import { apiConfig } from '@/constants';
import { ApiResponse, ApiResponseList, NotificationResType } from '@/types';
import { http } from '@/utils';

const notificationApiRequest = {
  getList: () =>
    http.get<ApiResponseList<NotificationResType>>(
      apiConfig.notification.getList
    ),
  countUnread: () =>
    http.get<ApiResponse<{ count: number }>>(
      apiConfig.notification.countUnread
    ),
  markRead: (id: string) =>
    http.put<ApiResponse<any>>(apiConfig.notification.markRead, {
      pathParams: {
        id
      }
    }),
  readAll: () => http.put<ApiResponse<any>>(apiConfig.notification.readAll),
  deleteAll: () =>
    http.delete<ApiResponse<any>>(apiConfig.notification.deleteAll)
};

export default notificationApiRequest;
