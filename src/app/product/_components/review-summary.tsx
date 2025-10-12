import { StarRating } from '@/components/star-rating';

export default function ReviewSummary({
  averageRate,
  totalReviews,
  getRatePercent
}: {
  averageRate: number;
  totalReviews: number;
  getRatePercent: (rate: number) => number;
}) {
  return (
    <>
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
    </>
  );
}
