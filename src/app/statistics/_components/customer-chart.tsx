'use client';

import { useAccountStatisticsQuery } from '@/queries';
import { AccountStatisticsResType } from '@/types';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export default function CustomerChart() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px'
  });
  const { data, isLoading } = useAccountStatisticsQuery({ enabled: inView });
  const items = data?.data?.items || [];
  const today = dayjs();
  const startOfMonth = today.startOf('month');

  const allDays = Array.from({ length: today.date() }, (_, i) =>
    startOfMonth.add(i, 'day').format('YYYY-MM-DD')
  );

  const mergedData = useMemo(() => {
    const map = new Map(
      (items as AccountStatisticsResType[]).map((d: any) => [
        d.date,
        parseFloat(d.total)
      ])
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
        Số lượng khách hàng mới {today.format('MM/YYYY')}
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
            allowDecimals={false}
            tickFormatter={(value) => Math.round(value).toString()}
          >
            <Label
              value='Số lượng'
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
            formatter={(value: number) => [value, 'Số lượng']}
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
