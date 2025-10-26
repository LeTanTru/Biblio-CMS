import orderApiRequest from '@/api-requests/order.api-request';
import { queryKeys } from '@/constants';
import { UpdateStatusBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useOrderQuery = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.ORDER, id],
    queryFn: () => orderApiRequest.getById(id),
    enabled: !!id
  });
};

export const useUpdateOrderStatusMutation = () => {
  return useMutation({
    mutationKey: [`update-${queryKeys.ORDER}-status`],
    mutationFn: (body: UpdateStatusBodyType) =>
      orderApiRequest.updateStatus(body)
  });
};
