'use client';
import { Button, ToolTip } from '@/components/form';
import { HasPermission } from '@/components/has-permission';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { BaseTable } from '@/components/table';
import {
  apiConfig,
  COUPON_TYPE_FIXED,
  couponKinds,
  couponStatuses,
  couponTypes,
  DATE_TIME_FORMAT,
  FieldTypes,
  STATUS_ACTIVE,
  STATUS_DELETED
} from '@/constants';
import { useListBase } from '@/hooks';
import { couponSearchParamSchema } from '@/schemaValidations';
import { ApiResponse, Column, SearchFormProps } from '@/types';
import { CouponResType, CouponSearchParamType } from '@/types/coupon.type';
import { formatDate, formatMoney, formatNumber, http, notify } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { RotateCcw } from 'lucide-react';

export default function CouponList({ queryKey }: { queryKey: string }) {
  const recoverMutation = useMutation({
    mutationKey: [`${queryKey}-recover`],
    mutationFn: (id: string) =>
      http.put<ApiResponse<any>>(apiConfig.coupon.recover, {
        pathParams: {
          id
        }
      })
  });
  const { data, pagination, loading, handlers, listQuery } = useListBase<
    CouponResType,
    CouponSearchParamType
  >({
    apiConfig: apiConfig.coupon,
    options: {
      queryKey,
      objectName: 'khuyến mãi',
      defaultFilters: {
        status: STATUS_ACTIVE
      }
    },
    override: (handlers) => {
      handlers.additionalColumns = () => ({
        recover: (record: CouponResType, buttonProps?: Record<string, any>) => {
          return (
            <HasPermission
              requiredPermissions={[apiConfig.category.recover.permissionCode]}
            >
              <ToolTip title={`Khôi phục`}>
                <span>
                  <Button
                    disabled={record.status === STATUS_ACTIVE}
                    onClick={async () => {
                      await recoverMutation.mutateAsync(record.id);
                      notify.success('Khôi phục thành công');
                      listQuery.refetch();
                    }}
                    className='border-none bg-transparent shadow-none hover:bg-transparent'
                    {...buttonProps}
                  >
                    <RotateCcw className='stroke-dodger-blue size-3.5' />
                  </Button>
                </span>
              </ToolTip>
            </HasPermission>
          );
        }
      });
    }
  });
  const columns: Column<CouponResType>[] = [
    {
      title: 'Tên khuyến mãi',
      dataIndex: 'name',
      render: (value) => (
        <span title={value} className='block truncate'>
          {value}
        </span>
      )
    },
    { title: 'Mã', dataIndex: 'code', width: 200, align: 'center' },
    {
      title: 'Loại',
      dataIndex: 'kind',
      render: (value) =>
        couponKinds.find((kind) => kind.value === value)?.label ?? '--',
      align: 'center',
      width: 150
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      render: (value) =>
        couponTypes.find((type) => type.value === value)?.label ?? '--',
      align: 'center',
      width: 150
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      align: 'center',
      width: 120,
      render: (value, record) =>
        record.type === COUPON_TYPE_FIXED
          ? formatMoney(value)
          : formatNumber(value)
    },
    {
      title: 'Giá trị tối thiểu',
      dataIndex: 'minOrderAmount',
      align: 'center',
      width: 150,
      render: (value) => `${formatMoney(value)}`
    },
    { title: 'Số lượng', dataIndex: 'quantity', width: 100, align: 'center' },
    {
      title: 'Hạn sử dụng',
      width: 350,
      align: 'center',
      render: (_, record) => {
        return `${formatDate(record.validFrom.toString(), DATE_TIME_FORMAT)} - ${formatDate(record.validTo.toString(), DATE_TIME_FORMAT)}`;
      }
    },
    handlers.renderActionColumn({
      actions: {
        edit: (record: CouponResType) => record.status === STATUS_ACTIVE,
        recover: (record: CouponResType) => record.status === STATUS_DELETED,
        delete: (record: CouponResType) => record.status === STATUS_ACTIVE
      },
      columnProps: {
        fixed: true
      }
    })
  ];
  const searchFields: SearchFormProps<CouponSearchParamType>['searchFields'] = [
    { key: 'name', placeholder: 'Tên khuyến mãi' },
    { key: 'code', placeholder: 'Mã khuyến mãi' },
    {
      key: 'kind',
      placeholder: 'Kiểu',
      type: FieldTypes.SELECT,
      options: couponKinds
    },
    {
      key: 'type',
      placeholder: 'Loại',
      type: FieldTypes.SELECT,
      options: couponTypes
    },
    {
      key: 'status',
      placeholder: 'Trạng thái',
      type: FieldTypes.SELECT,
      options: couponStatuses,
      submitOnChanged: true
    }
  ];
  return (
    <PageWrapper breadcrumbs={[{ label: 'Khuyến mãi' }]}>
      <ListPageWrapper
        searchForm={handlers.renderSearchForm({
          searchFields,
          schema: couponSearchParamSchema
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
