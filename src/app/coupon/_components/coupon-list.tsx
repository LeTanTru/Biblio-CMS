'use client';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { BaseTable } from '@/components/table';
import { apiConfig } from '@/constants';
import { useListBase } from '@/hooks';
import { couponSearchParamSchema } from '@/schemaValidations';
import { Column, SearchFormProps } from '@/types';
import { CouponResType, CouponSearchParamType } from '@/types/coupon.type';

export default function CouponList({ queryKey }: { queryKey: string }) {
  const { data, pagination, loading, handlers } = useListBase<
    CouponResType,
    CouponSearchParamType
  >({
    apiConfig: apiConfig.coupon,
    options: {
      queryKey,
      objectName: 'phiếu giảm giá'
    }
  });
  const columns: Column<CouponResType>[] = [
    {
      title: 'Tên khuyến mãi',
      dataIndex: 'name'
    },
    { title: 'Mã', dataIndex: 'code' },
    { title: 'Kiểu', dataIndex: 'type' },
    { title: 'Giá trị', dataIndex: 'value' },
    { title: 'Giá trị tối thiểu', dataIndex: 'minOrderAmount' },
    { title: 'Số lượng', dataIndex: 'quantity' },
    { title: 'Hạn sử dụng' },
    handlers.renderActionColumn({
      actions: {
        edit: true,
        delete: true
      }
    })
  ];
  const searchFields: SearchFormProps<CouponSearchParamType>['searchFields'] = [
    { key: 'name', placeholder: 'Tên khuyến mãi' }
  ];
  return (
    <PageWrapper breadcrumbs={[{ label: 'Tác giả' }]}>
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
