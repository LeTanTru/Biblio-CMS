'use client';

import ReviewList from '@/app/product/_components/review-list';
import { Col, Row } from '@/components/form';
import { Modal } from '@/components/modal';
import { StarRating } from '@/components/star-rating';
import { useReviewSummaryQuery } from '@/queries';
import { ReviewSummaryResType } from '@/types';

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

  return (
    <Modal open={open} onClose={onClose} className='[&_.content]:w-200'>
      <Row className='mt-4 mb-0 h-[70dvh] flex-col items-center p-4'>
        <Col span={10} gutter={0} className='flex-row items-center gap-x-5'>
          <div className='flex flex-col items-center justify-center gap-y-2'>
            <p className='text-xl'>
              <span className='text-4xl'>{averageRate}</span>/5
            </p>
            <StarRating showValue={false} value={averageRate} />
            <div>{totalReviews} đánh giá</div>
          </div>
          <div className='flex-1'>
            {[...Array(5)].map((item, index) => (
              <div
                key={index}
                className='flex items-center justify-between gap-x-2 not-last:mb-1'
              >
                <span className='w-10 text-right whitespace-nowrap'>
                  {5 - index} sao
                </span>
                <div className='relative h-1.5 w-4/5 overflow-hidden rounded-lg bg-gray-200'>
                  <div
                    className='h-full rounded-lg bg-yellow-400'
                    style={{ width: `${getRatePercent(5 - index)}%` }}
                  />
                </div>
                <span className='w-2'>{getRatePercent(5 - index)}%</span>
              </div>
            ))}
          </div>
        </Col>
        <Col gutter={0}>
          <ReviewList productId={productId} />
        </Col>
      </Row>
    </Modal>
  );
}
