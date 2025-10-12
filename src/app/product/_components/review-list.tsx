'use client';

import ReviewItem from '@/app/product/_components/review-item';
import ReviewItemSkeleton from '@/app/product/_components/review-item-skeleton';
import { NoData } from '@/components/no-data';
import { apiConfig, queryKeys } from '@/constants';
import { useListBase } from '@/hooks';
import { ReviewResType, ReviewSearchType } from '@/types';

export default function ReviewList({ productId }: { productId: string }) {
  const { data: reviews, loading } = useListBase<
    ReviewResType,
    ReviewSearchType
  >({
    apiConfig: apiConfig.review,
    options: {
      objectName: 'đánh giá',
      queryKey: queryKeys.REVIEW,
      excludeFromQueryFilter: ['page', 'status', 'size']
    },
    override: (handlers) => {
      handlers.additionalParams = () => ({
        productId
      });
    }
  });
  return loading ? (
    [...Array(8)].map((_, index) => <ReviewItemSkeleton key={index} />)
  ) : reviews?.length ? (
    reviews.map((review) => <ReviewItem key={review.id} review={review} />)
  ) : (
    <NoData content='Chưa có đánh giá' className='min-h-full' />
  );
}
