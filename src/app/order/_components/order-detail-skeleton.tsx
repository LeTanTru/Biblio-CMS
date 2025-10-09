import { Separator } from '@/components/ui/separator';
import React from 'react';

export default function OrderDetailSkeleton() {
  return (
    <div className='h-full animate-pulse rounded-lg bg-white px-4 shadow-[0px_0px_10px_2px] shadow-gray-200'>
      <div className='flex items-center justify-between py-4'>
        <div className='skeleton h-5 w-32 rounded'></div>
        <div className='skeleton h-6 w-20 rounded'></div>
      </div>
      <Separator />

      <div className='relative grid grid-cols-7 py-4'>
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className='relative flex flex-col items-center text-center select-none'
          >
            <div className='skeleton mb-2 h-14 w-14 rounded-full'></div>
            <div className='skeleton mb-1 h-3 w-20 rounded'></div>
            <div className='skeleton h-2 w-12 rounded'></div>
          </div>
        ))}
      </div>
      <Separator />

      <div className='flex items-center gap-2 py-4'>
        <div className='skeleton h-5 w-5 rounded'></div>
        <div className='skeleton h-4 w-64 rounded'></div>
      </div>
      <Separator />

      <div className='flex items-center gap-2 py-4'>
        <div className='skeleton h-5 w-5 rounded'></div>
        <div className='skeleton h-4 w-52 rounded'></div>
      </div>
      <Separator />

      {[...Array(2)].map((_, i) => (
        <div key={i}>
          <div className='flex items-center gap-4 py-4'>
            <div className='skeleton h-20 w-20 rounded-lg'></div>
            <div className='flex-1 space-y-2'>
              <div className='skeleton h-5 w-2/3 rounded'></div>
              <div className='skeleton h-4 w-40 rounded'></div>
              <div className='skeleton h-4 w-24 rounded'></div>
            </div>
            <div className='skeleton h-5 w-16 rounded'></div>
          </div>
          <Separator />
        </div>
      ))}

      <div className='space-y-2 py-4'>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className='flex h-10 items-center justify-end gap-x-10 text-right'
          >
            <div className='skeleton h-4 w-40 rounded'></div>
            <div className='skeleton h-4 w-24 rounded'></div>
          </div>
        ))}
      </div>
    </div>
  );
}
