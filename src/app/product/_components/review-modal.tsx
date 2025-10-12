'use client';
import ReviewList from '@/app/product/_components/review-list';
import ReviewSummary from '@/app/product/_components/review-summary';
import ReviewSummarySkeleton from '@/app/product/_components/review-summary-skeleton';
import { Col, Row } from '@/components/form';
import { Modal } from '@/components/modal';
import { apiConfig, queryKeys } from '@/constants';
import { useListBase } from '@/hooks';
import { cn } from '@/lib';
import { useReviewSummaryQuery } from '@/queries';
import { ReviewResType, ReviewSearchType, ReviewSummaryResType } from '@/types';
import { useEffect } from 'react';

export default function ReviewModal({
  open,
  onClose,
  productId
}: {
  open: boolean;
  onClose: () => void;
  productId: string;
}) {
  const reviewSummaryQuery = useReviewSummaryQuery({
    productId,
    enabled: !!productId
  });

  const {
    data: reviews,
    loading,
    listQuery
  } = useListBase<ReviewResType, ReviewSearchType>({
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

  const reviewSummary = reviewSummaryQuery?.data?.data?.content ?? [];

  const totalReviews =
    reviewSummary?.reduce(
      (sum: number, i: ReviewSummaryResType) => sum + i.total,
      0
    ) ?? 0;

  const getRatePercent = (rate: number) => {
    if (!reviewSummary || totalReviews === 0) return 0;

    const item = reviewSummary.find(
      (r: ReviewSummaryResType) => r.rate === rate
    );
    return item ? Math.round((item.total / totalReviews) * 100) : 0;
  };

  const averageRate =
    totalReviews > 0
      ? Math.round(
          (reviewSummary.reduce(
            (sum: number, i: ReviewSummaryResType) => sum + i.rate * i.total,
            0
          ) /
            totalReviews) *
            10
        ) / 10
      : 0;

  useEffect(() => {
    listQuery.refetch();
  }, [productId]);

  return (
    <Modal open={open} onClose={onClose} className='[&_.content]:w-200'>
      <Row className='mb-0 h-[70dvh] flex-col items-center py-4'>
        <Col
          span={10}
          gutter={0}
          className='mb-4 flex-row items-center gap-x-5'
        >
          {reviewSummaryQuery.isLoading || reviewSummaryQuery.isFetching ? (
            <ReviewSummarySkeleton />
          ) : (
            <ReviewSummary
              averageRate={averageRate}
              totalReviews={totalReviews}
              getRatePercent={getRatePercent}
            />
          )}
        </Col>
        <Col
          gutter={0}
          className={cn('h-full overflow-auto pl-4', {
            'pr-2': reviews.length > 5,
            'pr-4': reviews.length <= 5
          })}
        >
          <ReviewList reviews={reviews} loading={loading} />
        </Col>
      </Row>
    </Modal>
  );
}
