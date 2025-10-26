'use client';

import { useCountNewCustomerQuery } from '@/queries';
import CountUp from 'react-countup';

export default function NewCustomerCard() {
  const { data, isLoading } = useCountNewCustomerQuery();
  const newCustomerCount = data?.data?.totalAccounts || 0;

  return (
    <div className='flex min-h-35 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md'>
      <h3 className='mb-2 text-lg font-medium text-gray-600'>Khách hàng mới</h3>

      {isLoading ? (
        <div className='animate-pulse space-y-2'>
          <div className='skeleton h-5 w-32 rounded bg-gray-200'></div>
        </div>
      ) : (
        <div className='flex flex-col'>
          <CountUp
            className='text-2xl font-bold text-gray-900'
            start={0}
            end={+(newCustomerCount ?? 0)}
          />
        </div>
      )}
    </div>
  );
}
