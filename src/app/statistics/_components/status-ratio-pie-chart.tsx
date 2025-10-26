'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useOrderStatusRatioQuery } from '@/queries';
import { orderStatuses } from '@/constants';

export default function StatusRatioPieChart() {
  const { data, isLoading } = useOrderStatusRatioQuery();
  const orderStatusRatio = data?.data?.status || [];

  const chartData = orderStatusRatio
    .map((item) => {
      const statusInfo = orderStatuses.find((s) => s.value === item.status);
      return {
        name: statusInfo?.label || `Trạng thái ${item.status}`,
        value: item.percentage,
        color: statusInfo?.color?.split(' ')[0].replace('bg-', '') || 'gray'
      };
    })
    .filter((item) => item.value > 0);

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center text-gray-500'>
        Đang tải dữ liệu...
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <p className='text-center text-sm text-gray-500 italic'>
        Chưa có dữ liệu đơn hàng.
      </p>
    );
  }

  return (
    <div className='rounded-lg border bg-white p-4 shadow-sm'>
      <h3 className='text-center text-base font-semibold text-gray-800'>
        Tỷ lệ trạng thái đơn hàng
      </h3>
      <div className='flex items-center justify-center'>
        <ResponsiveContainer width='100%' height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='name'
              outerRadius={100}
              innerRadius={60}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${(index * 40) % 360}, 70%, 55%)`}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)}%`}
              contentStyle={{ fontSize: '0.8rem' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className='mx-auto mt-4 grid max-w-120 grid-cols-2 gap-2 gap-x-10 text-sm'>
        {chartData.map((item, index) => (
          <div key={index} className='flex items-center gap-2'>
            <span
              className='h-3 w-3 rounded-full'
              style={{
                backgroundColor: `hsl(${(index * 40) % 360}, 70%, 55%)`
              }}
            />
            <span className='truncate text-gray-700'>{item.name}</span>
            <span className='ml-auto text-gray-500'>
              {item.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
