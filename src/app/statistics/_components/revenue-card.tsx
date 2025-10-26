'use client';

import { useGetRevenueQuery } from '@/queries';
import CountUp from 'react-countup';

export default function RevenueCard() {
  const { data, isLoading } = useGetRevenueQuery();
  const revenue = data?.data;

  return (
    <div className='flex min-h-35 flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md'>
      <h3 className='mb-2 text-lg font-medium text-gray-600'>
        Doanh thu tháng này
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
            end={+(revenue?.totalRevenue ?? 0)}
            suffix=' ₫'
          />
          <CountUp
            className='text-sm font-semibold text-green-600'
            start={0}
            end={+(revenue?.totalOrders ?? 0)}
            suffix=' đơn hàng'
          />
        </div>
      )}
    </div>
  );
}
