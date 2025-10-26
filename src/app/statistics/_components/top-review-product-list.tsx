'use client';

import { StarRating } from '@/components/star-rating';
import { useTopReviewListQuery } from '@/queries';
import { TopReviewResType } from '@/types';
import { formatMoney, renderImageUrl } from '@/utils';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

export default function TopReviewProductList() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px'
  });
  const { data, isLoading } = useTopReviewListQuery({
    enabled: inView
  });
  const products: TopReviewResType[] = data?.data?.content || [];

  return (
    <div className='space-y-4 pb-4' ref={ref}>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-gray-800'>
          📚 Top sách được đánh giá cao
        </h2>
        <span className='text-sm text-gray-500'>
          {products.length > 0 && `Tổng: ${products.length} sản phẩm`}
        </span>
      </div>

      {isLoading ? (
        <div className='space-y-3 py-4'>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className='flex items-center gap-4 rounded-lg border bg-gray-50 p-3'
            >
              <div className='skeleton h-20 w-20 rounded-md bg-gray-200' />
              <div className='flex-1 space-y-2'>
                <div className='skeleton h-4 w-3/4 rounded bg-gray-200' />
                <div className='skeleton h-4 w-1/2 rounded bg-gray-200' />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className='text-sm text-gray-500 italic'>
          Không có sản phẩm nào được đánh giá cao.
        </p>
      ) : (
        <div className='space-y-3'>
          {products.map((product, index) => {
            const hasDiscount = product.discount > 0;
            const discountedPrice = hasDiscount
              ? product.price * (1 - product.discount / 100)
              : product.price;

            return (
              <div
                key={product.productId}
                className='flex items-center gap-4 rounded-lg border bg-white p-3 transition-all duration-200 hover:shadow-md'
              >
                <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-50'>
                  <Image
                    src={renderImageUrl(product.image)}
                    alt={product.name}
                    fill
                    className='object-contain'
                  />
                  <span className='absolute top-1 left-1 rounded-md bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-white'>
                    TOP {index + 1}
                  </span>
                  {hasDiscount && (
                    <span className='bg-dodger-blue absolute right-1 bottom-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white'>
                      -{product.discount}%
                    </span>
                  )}
                </div>

                <div className='min-w-0 flex-1'>
                  <h3 className='line-clamp-1 text-sm font-semibold text-gray-800'>
                    {product.name}
                  </h3>
                  <p className='mb-1 text-xs text-gray-500'>
                    {product.category?.name}
                  </p>

                  <div className='mb-2 flex items-baseline gap-2'>
                    <p className='text-base font-bold text-gray-900'>
                      {formatMoney(discountedPrice)}
                    </p>
                    {hasDiscount && (
                      <p className='text-xs text-gray-400 line-through'>
                        {formatMoney(product.price)}
                      </p>
                    )}
                  </div>

                  <div className='flex items-center gap-x-2'>
                    <StarRating size={15} value={+product.averageRating} /> (
                    {product.totalReviews} đánh giá)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
