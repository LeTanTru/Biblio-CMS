import { notificationApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useNotificationListQuery = ({
  enabled = false
}: {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [`${queryKeys.NOTIFICATION}-list`],
    queryFn: () => notificationApiRequest.getList(),
    enabled
  });
};

export const useCountUnreadNotificationQuery = () => {
  return useQuery({
    queryKey: [`count-unread-${queryKeys.NOTIFICATION}`],
    queryFn: () => notificationApiRequest.countUnread()
  });
};

export const useMarkReadNotificationMutation = () => {
  return useMutation({
    mutationKey: [`mark-read-${queryKeys.NOTIFICATION}`],
    mutationFn: (id: string) => notificationApiRequest.markRead(id)
  });
};

export const useReadAllNotificationMutation = () => {
  return useMutation({
    mutationKey: [`read-all-${queryKeys.NOTIFICATION}`],
    mutationFn: () => notificationApiRequest.readAll()
  });
};

export const useDeleteAllNotificationMutation = () => {
  return useMutation({
    mutationKey: [`delete-all-${queryKeys.NOTIFICATION}`],
    mutationFn: () => notificationApiRequest.deleteAll()
  });
};
