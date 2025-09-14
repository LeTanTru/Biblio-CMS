'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import './base-table.css';

import Pagination from '@/components/pagination';
import { BaseTableProps } from '@/types';
import Image from 'next/image';
import { emptyData } from '@/assets';
import { cn } from '@/lib';
import { CircleLoading } from '@/components/loading';
import { AnimatePresence, motion } from 'framer-motion';

export default function BaseTable<T extends Record<any, any>>({
  columns,
  dataSource,
  rowKey = 'id',
  pagination,
  changePagination,
  loading
}: BaseTableProps<T>) {
  const { total } = pagination;
  return (
    <div className='flex flex-col gap-y-5 rounded-br-lg rounded-bl-lg bg-white text-sm'>
      <div className='base-table relative flex-1'>
        <div className='w-full overflow-x-auto'>
          <Table className='w-full min-w-200'>
            <TableHeader className='bg-gray-50'>
              <TableRow className='border-b-[0.2px]'>
                {columns.map((col, idx) => {
                  const isLast = idx === columns.length - 1;
                  return (
                    <TableHead
                      key={idx}
                      className={cn(
                        `relative bg-zinc-50 px-4 py-4 text-sm! leading-5.5 text-black ${
                          col.align ? `text-${col.align}` : 'text-left'
                        }`,
                        {
                          'before:absolute before:top-1/2 before:right-0 before:h-1/2 before:w-0.5 before:-translate-y-1/2 before:bg-zinc-100':
                            !isLast,
                          'sticky right-0 z-30': col.fixed
                        }
                      )}
                      style={{ width: col.width }}
                    >
                      {col.title}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody className='[&_tr:last-child]:border-b-none'>
              {dataSource.length > 0 ? (
                <>
                  {dataSource.map((row, rowIndex) => (
                    <TableRow
                      key={String(row[rowKey])}
                      className='border-b-[0.2px] hover:bg-zinc-50'
                    >
                      {columns.map((col, colIndex) => {
                        return (
                          <TableCell
                            key={colIndex}
                            className={cn(
                              `relative h-[65px] px-4 leading-8 ${
                                col.align ? `text-${col.align}` : 'text-left'
                              }`,
                              {
                                'sticky right-0 z-30': col.fixed
                              }
                            )}
                          >
                            {col.render
                              ? col.render(
                                  col.dataIndex
                                    ? row[col.dataIndex]
                                    : undefined,
                                  row,
                                  rowIndex
                                )
                              : col.dataIndex
                                ? row[col.dataIndex]
                                : null}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                  {!(!total || total <= 1) && (
                    <TableRow className='hover:bg-transparent'>
                      <TableCell
                        colSpan={columns.length}
                        className='py-4 text-right'
                      >
                        <Pagination
                          changePagination={changePagination}
                          currentPage={pagination.current}
                          totalPages={total}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ) : (
                dataSource.length === 0 &&
                !loading && (
                  <TableRow className='hover:bg-transparent'>
                    <TableCell
                      colSpan={columns.length}
                      className='py-8 text-center align-middle'
                      style={{ textAlign: 'center' }}
                    >
                      <div className='flex flex-col items-center justify-center'>
                        <Image
                          src={emptyData.src}
                          alt='Không có dữ liệu'
                          width={150}
                          height={50}
                        />
                        <span>Không có dữ liệu</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'linear' }}
              className='absolute inset-0 top-[55px] z-50 flex items-start justify-center bg-white/70 pt-5'
            >
              <CircleLoading className='stroke-dodger-blue size-8' />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
