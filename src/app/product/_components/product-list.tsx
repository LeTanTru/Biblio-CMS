'use client';

import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { BaseTable } from '@/components/table';
import { apiConfig } from '@/constants';
import { useListBase } from '@/hooks';
import route from '@/routes';
import { productSearchParamSchema } from '@/schemaValidations';
import {
  Column,
  ProductResType,
  ProductSearchParamType,
  SearchFormProps
} from '@/types';

export default function ProductList({ queryKey }: { queryKey: string }) {
  const { data, loading, handlers, queryFilter, pagination } = useListBase<
    ProductResType,
    ProductSearchParamType
  >({
    apiConfig: apiConfig.product,
    options: {
      queryKey,
      objectName: 'sách'
    }
  });
  const columns: Column<ProductResType>[] = [
    {
      title: '#',
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index,
      width: 30
    },
    {
      title: 'Tên sách',
      dataIndex: 'name'
    },
    { title: 'Giá', dataIndex: 'price' },
    { title: 'Ngày bán', dataIndex: 'releaseDate' },
    { title: 'Độ tuổi', dataIndex: 'ageRating' },
    { title: 'Ngôn ngữ', dataIndex: 'language' },
    { title: 'Thông số', dataIndex: 'metaData' },
    { title: 'Giảm giá', dataIndex: 'discount' },
    { title: 'Danh mục', dataIndex: 'category' },
    { title: 'Nhà xuất bản', dataIndex: 'publisher' },
    handlers.renderStatusColumn(),
    handlers.renderActionColumn({
      actions: {
        edit: true,
        delete: true
      },
      columnProps: {
        fixed: true
      }
    })
  ];

  const searchFields: SearchFormProps<ProductSearchParamType>['searchFields'] =
    [
      { key: 'name', placeholder: 'Tên sách' },
      { key: 'ageRating', placeholder: 'Độ tuổi' },
      { key: 'categoryId', placeholder: 'Danh mục' },
      { key: 'isFeatured', placeholder: 'Nổi bật' },
      { key: 'language', placeholder: 'Ngôn ngữ' },
      { key: 'publisherId', placeholder: 'Nhà xuất bản' }
    ];
  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Trang chủ', href: route.home.path },
        { label: 'Sách' }
      ]}
    >
      <ListPageWrapper
        searchForm={handlers.renderSearchForm({
          searchFields,
          schema: productSearchParamSchema,
          initialValues: { ...queryFilter }
        })}
        actionBar={handlers.renderAddButton()}
      >
        <BaseTable
          columns={columns}
          dataSource={data || []}
          pagination={pagination}
          loading={loading}
          changePagination={handlers.changePagination}
        />
      </ListPageWrapper>
    </PageWrapper>
  );
}
