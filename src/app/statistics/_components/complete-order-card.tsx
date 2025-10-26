import { ORDER_DETAIL_STATUS_RECEIVED } from '@/constants';
import { useOrderStatusRatioQuery } from '@/queries';
import React from 'react';
import CountUp from 'react-countup';

export default function CompleteOrderRatioCard() {
  const { data, isLoading } = useOrderStatusRatioQuery();
  const statusRatio = data?.data?.status || [];
  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center text-gray-500'>
        Đang tải dữ liệu...
      </div>
    );
  }
  const completeRatio = statusRatio?.find(
    (item) => item.status === ORDER_DETAIL_STATUS_RECEIVED
  );

  return (
    <div className='flex min-h-35 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md'>
      <h3 className='mb-2 text-lg font-medium text-gray-600'>
        Tỉ lệ đơn hàng thành công
      </h3>

      {isLoading ? (
        <div className='animate-pulse space-y-2'>
          <div className='skeleton h-5 w-32 rounded bg-gray-200'></div>
          <div className='skeleton h-4 w-24 rounded bg-gray-200'></div>
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          <CountUp
            className='text-2xl font-bold text-gray-900'
            start={0}
            end={+(completeRatio?.percentage ?? 0)}
            suffix=' %'
            decimals={2}
          />
          <CountUp
            className='font-bold text-green-600'
            start={0}
            end={+(completeRatio?.total ?? 0)}
            suffix=' đơn hàng'
          />
        </div>
      )}
    </div>
  );
}
