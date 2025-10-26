import { productApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { useQuery } from '@tanstack/react-query';

export const useTopViewProductListQuery = ({
  enabled = false
}: {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [`top-view-${queryKeys.PRODUCT}-list`],
    queryFn: () => productApiRequest.getTopViewList(),
    enabled
  });
};

export const useTopDiscountProductListQuery = ({
  enabled = false
}: {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [`top-discount-${queryKeys.PRODUCT}-list`],
    queryFn: () => productApiRequest.getTopDiscountList(),
    enabled
  });
};

export const useBestSellerProductListQuery = ({
  enabled = false
}: {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [`best-seller-${queryKeys.PRODUCT}-list`],
    queryFn: () => productApiRequest.getBestSellerList(),
    enabled
  });
};
