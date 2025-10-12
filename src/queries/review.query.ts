import { reviewApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { useQuery } from '@tanstack/react-query';

export const useReviewSummaryQuery = ({
  productId,
  enabled
}: {
  productId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.REVIEW, productId],
    queryFn: () => reviewApiRequest.summary(productId),
    enabled
  });
};
