import orderApiRequest from '@/api-requests/order.api-request';
import { queryKeys } from '@/constants';
import { useQuery } from '@tanstack/react-query';

export const useGetRevenueQuery = () => {
  return useQuery({
    queryKey: [`${queryKeys.STATISTICS}-revenue`],
    queryFn: () => orderApiRequest.getRevenue()
  });
};

export const useCountNewCustomerQuery = () => {
  return useQuery({
    queryKey: [`${queryKeys.STATISTICS}-new-customer`],
    queryFn: () => orderApiRequest.getNewCustomerCount()
  });
};

export const useOrderStatusRatioQuery = () => {
  return useQuery({
    queryKey: [`${queryKeys.STATISTICS}-order-status-ratio`],
    queryFn: () => orderApiRequest.getStatusRatio()
  });
};

export const useRevenueStatisticsQuery = ({
  enabled
}: {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [`${queryKeys.STATISTICS}-revenue-list`],
    queryFn: () => orderApiRequest.getRevenueStatistics(),
    enabled
  });
};
