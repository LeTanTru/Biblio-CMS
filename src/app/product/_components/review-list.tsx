'use client';

import ReviewItem from '@/app/product/_components/review-item';
import ReviewItemSkeleton from '@/app/product/_components/review-item-skeleton';
import { NoData } from '@/components/no-data';
import { ReviewResType } from '@/types';

export default function ReviewList({
  reviews,
  loading
}: {
  reviews: ReviewResType[];
  loading: boolean;
}) {
  return loading ? (
    [...Array(8)].map((_, index) => <ReviewItemSkeleton key={index} />)
  ) : reviews?.length ? (
    reviews.map((review) => <ReviewItem key={review.id} review={review} />)
  ) : (
    <NoData content='Chưa có đánh giá' className='min-h-full' />
  );
}
