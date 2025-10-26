import viewedProductApiRequest from '@/api-requests/viewed-product.api-request';
import { queryKeys } from '@/constants';
import { useQuery } from '@tanstack/react-query';

export const useTopViewedProductListQuery = ({
  enabled
}: {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.VIEWED_PRODUCT],
    queryFn: () => viewedProductApiRequest.getTopViewedList(),
    enabled
  });
};
