'use client';

import { Button, ToolTip } from '@/components/form';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { BaseTable } from '@/components/table';
import { Badge } from '@/components/ui/badge';
import {
  apiConfig,
  DATE_TIME_FORMAT,
  orderStatuses,
  paymentMethods,
  statusOptions
} from '@/constants';
import { useListBase, useNavigate } from '@/hooks';
import { cn } from '@/lib';
import route from '@/routes';
import { orderSearchSchema } from '@/schemaValidations';
import {
  Column,
  OptionType,
  OrderResType,
  OrderSearchType,
  SearchFormProps
} from '@/types';
import { formatDate, formatMoney, generatePath } from '@/utils';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function OrderList({ queryKey }: { queryKey: string }) {
  const navigate = useNavigate();
  const { data, pagination, loading, handlers } = useListBase<
    OrderResType,
    OrderSearchType
  >({
    apiConfig: apiConfig.order,
    options: {
      queryKey,
      objectName: 'đơn hàng'
    },
    override: (handlers) => {
      handlers.renderStatusColumn = (options?: {
        statusOptions?: OptionType[];
        columnProps?: Record<string, any>;
      }): Column<OrderResType> => {
        return {
          title: 'Trạng thái',
          width: 150,
          dataIndex: 'currentStatus',
          align: 'center',
          ...options?.columnProps,
          render: (value) => {
            const status = (options?.statusOptions || statusOptions).find(
              (st) => st.value === value
            );
            return (
              <Badge className={cn('text-sm font-normal', status?.color)}>
                {status?.label}
              </Badge>
            );
          }
        };
      };
      handlers.additionalColumns = () => {
        return {
          view: (record: OrderResType, buttonProps?: Record<string, any>) => {
            return (
              <ToolTip title={`Xem chi tiết`}>
                <span>
                  <Button
                    className='border-none bg-transparent shadow-none hover:bg-transparent'
                    {...buttonProps}
                  >
                    <Eye className='stroke-dodger-blue size-3.5' />
                  </Button>
                </span>
              </ToolTip>
            );
          }
        };
      };
    }
  });

  const columns: Column<OrderResType>[] = [
    {
      title: '#',
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 50,
      align: 'center'
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      width: 200,
      align: 'center',
      render: (value, record) => (
        <span
          className='text-dodger-blue font-medium block w-full cursor-pointer truncate'
          onClick={() =>
            navigate(
              generatePath(route.order.savePage.path, {
                id: record.id
              })
            )
          }
        >
          {value}
        </span>
      )
    },
    {
      title: 'Người mua',
      dataIndex: ['account', 'fullName']
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      render: (value) => {
        const payment = paymentMethods.find(
          (paymentMethod) => paymentMethod.value === value
        );
        if (!payment) return <span>Chưa thanh toán</span>;
        return (
          <Image
            src={payment.icon}
            alt={payment.label}
            height={48}
            title={payment.label}
            width={80}
            className='mx-auto h-12 w-20 object-contain object-center select-none'
          />
        );
      },
      width: 200,
      align: 'center'
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      width: 180,
      align: 'center',
      render: (value) => formatMoney(value)
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdDate',
      render: (value) => formatDate(value, DATE_TIME_FORMAT),
      width: 220,
      align: 'center'
    },
    handlers.renderStatusColumn({
      statusOptions: orderStatuses,
      columnProps: { width: 220 }
    }),
    handlers.renderActionColumn({
      actions: {
        view: true
      }
    })
  ];

  const searchFields: SearchFormProps<OrderSearchType>['searchFields'] = [
    { key: 'currentStatus', placeholder: 'Trạng thái' },
    { key: 'accountId', placeholder: 'Người mua' },
    {
      key: 'paymentMethod',
      placeholder: 'Phương thức thanh toán'
    }
  ];

  return (
    <PageWrapper breadcrumbs={[{ label: 'Đơn hàng' }]}>
      <ListPageWrapper
        searchForm={handlers.renderSearchForm({
          searchFields,
          schema: orderSearchSchema
        })}
        addButton={handlers.renderAddButton()}
        reloadButton={handlers.renderReloadButton()}
      >
        <BaseTable
          columns={columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          changePagination={handlers.changePagination}
        />
      </ListPageWrapper>
    </PageWrapper>
  );
}
