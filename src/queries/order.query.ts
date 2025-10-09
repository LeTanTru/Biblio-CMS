import orderApiRequest from '@/api-requests/order.api-request';
import { useQuery } from '@tanstack/react-query';

export const useOrderQuery = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApiRequest.getById(id),
    enabled: !!id
  });
};
