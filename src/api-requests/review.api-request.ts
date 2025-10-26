import { apiConfig } from '@/constants';
import {
  ApiResponseList,
  ReviewSummaryResType,
  TopReviewResType
} from '@/types';
import { http } from '@/utils';

const reviewApiRequest = {
  summary: (productId: string) =>
    http.get<ApiResponseList<ReviewSummaryResType>>(apiConfig.review.summary, {
      pathParams: {
        productId
      }
    }),
  getTopReview: () =>
    http.get<ApiResponseList<TopReviewResType>>(
      apiConfig.review.getTopReviewList
    )
};

export default reviewApiRequest;
