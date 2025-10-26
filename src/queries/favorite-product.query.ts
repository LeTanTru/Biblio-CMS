import { favoriteProductApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { useQuery } from '@tanstack/react-query';

export const useTopFavoriteProductListQuery = ({
  enabled
}: {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.FAVORITE_PRODUCT],
    queryFn: () => favoriteProductApiRequest.getTopFavoriteList(),
    enabled
  });
};
