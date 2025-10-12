import { defaultAvatar } from '@/assets';
import { StarRating } from '@/components/star-rating';
import { DATE_TIME_FORMAT } from '@/constants';
import { ReviewResType } from '@/types';
import { formatDate, renderImageUrl } from '@/utils';
import Image from 'next/image';

export default function ReviewItem({ review }: { review: ReviewResType }) {
  return (
    <div className='flex w-full items-start gap-6 border-b py-4 first:border-t last:border-b-0 last:pb-0'>
      <Image
        src={renderImageUrl(review?.account?.avatarPath) ?? defaultAvatar}
        alt='Avatar'
        width={50}
        height={50}
        className='rounded-full object-contain'
      />
      <div className='flex flex-col gap-1.5'>
        <div className='flex items-center gap-3'>
          <span className='font-semibold'>{review?.account?.fullName}</span>
          <span className='text-xs font-light text-gray-600'>
            {formatDate(review?.createdDate, DATE_TIME_FORMAT)}
          </span>
        </div>
        <StarRating value={review?.rate} size={15} showValue={false} />
        <p className='mt-2'>{review?.content}</p>
      </div>
    </div>
  );
}
