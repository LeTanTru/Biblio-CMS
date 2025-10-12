import { apiConfig } from '@/constants';
import { ApiResponseList, ReviewSummaryResType } from '@/types';
import { http } from '@/utils';

const reviewApiRequest = {
  summary: (productId: string) =>
    http.get<ApiResponseList<ReviewSummaryResType>>(apiConfig.review.summary, {
      pathParams: {
        productId
      }
    })
};

export default reviewApiRequest;
