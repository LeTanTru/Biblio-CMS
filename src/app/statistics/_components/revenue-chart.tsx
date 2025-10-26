'use client';
import { useRevenueStatisticsQuery } from '@/queries';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Label
} from 'recharts';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { RevenueResType } from '@/types';
import { useInView } from 'react-intersection-observer';

export default function RevenueChart() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px'
  });

  const { data, isLoading } = useRevenueStatisticsQuery({ enabled: inView });
  const items = data?.data?.items ?? [];

  const today = dayjs();
  const startOfMonth = today.startOf('month');

  const allDays = Array.from({ length: today.date() }, (_, i) =>
    startOfMonth.add(i, 'day').format('YYYY-MM-DD')
  );

  const mergedData = useMemo(() => {
    const map = new Map(
      (items as RevenueResType[]).map((d: any) => [d.date, parseFloat(d.total)])
    );
    return allDays.map((date) => ({
      date,
      total: map.get(date) || 0
    }));
  }, [items]);

  if (isLoading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className='h-[500px] w-full rounded-lg bg-white p-6 shadow' ref={ref}>
      <h2 className='mb-4 text-lg font-semibold'>
        Doanh thu tháng {today.format('MM/YYYY')}
      </h2>

      <ResponsiveContainer width='100%' height='90%'>
        <LineChart
          data={mergedData}
          margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray='3 3' />

          <XAxis
            dataKey='date'
            tickFormatter={(d) => dayjs(d).format('DD/MM')}
            interval={Math.ceil(allDays.length / 10)}
            height={50}
          >
            <Label
              value='Ngày trong tháng'
              offset={-5}
              position='insideBottom'
              style={{ fill: '#555', fontSize: 14 }}
            />
          </XAxis>

          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(
                value
              )
            }
          >
            <Label
              value='Doanh thu (VND)'
              angle={-90}
              position='insideLeft'
              style={{ textAnchor: 'middle', fill: '#555', fontSize: 14 }}
            />
          </YAxis>

          <Tooltip
            cursor={{
              stroke: '#1678ff',
              strokeWidth: 1
            }}
            formatter={(value: number) => [
              new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(value),
              'Doanh thu'
            ]}
            labelFormatter={(d) => dayjs(d).format('DD/MM/YYYY')}
          />

          <Line
            type='monotone'
            dataKey='total'
            stroke='#1678ff'
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
