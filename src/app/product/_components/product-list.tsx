'use client';

import ProductImageModal from '@/app/product/_components/product-image-modal';
import { Button, ToolTip } from '@/components/form';
import { HasPermission } from '@/components/has-permission';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { BaseTable } from '@/components/table';
import {
  ageRatings,
  apiConfig,
  FieldTypes,
  languageOptions,
  productStatuses,
  STATUS_ACTIVE,
  STATUS_DELETED
} from '@/constants';
import {
  useDisclosure,
  useListBase,
  useNavigate,
  useQueryParams
} from '@/hooks';
import { cn } from '@/lib';
import route from '@/routes';
import { productSearchParamSchema } from '@/schemaValidations';
import {
  ApiResponse,
  ApiResponseList,
  CategoryAutoResType,
  CategoryResType,
  Column,
  ProductBodyType,
  ProductResType,
  ProductSearchParamType,
  PublisherResType,
  SearchFormProps
} from '@/types';
import {
  formatDate,
  formatMoney,
  generatePath,
  http,
  notify,
  renderListPageUrl
} from '@/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FileImage, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function ProductList({ queryKey }: { queryKey: string }) {
  const navigate = useNavigate();
  const { searchParams, serializeParams } = useQueryParams();
  const categoryRes = useQuery({
    queryKey: ['category-auto-complete'],
    queryFn: () =>
      http.get<ApiResponseList<CategoryAutoResType>>(
        apiConfig.category.autoComplete
      )
  });
  const publisherRes = useQuery({
    queryKey: ['publisher-auto-complete'],
    queryFn: () =>
      http.get<ApiResponseList<PublisherResType>>(
        apiConfig.publisher.autoComplete
      )
  });
  const recoverMutation = useMutation({
    mutationKey: [`${queryKey}-recover`],
    mutationFn: (id: string) =>
      http.put<ApiResponse<any>>(apiConfig.product.recover, {
        pathParams: {
          id
        }
      })
  });
  const { opened, open, close } = useDisclosure(false);
  const [selectedRow, setSelectedRow] = useState<ProductResType | null>(null);
  const { data, loading, handlers, pagination, listQuery } = useListBase<
    ProductResType,
    ProductSearchParamType
  >({
    apiConfig: apiConfig.product,
    options: {
      queryKey,
      objectName: 'sách',
      defaultFilters: {
        status: STATUS_ACTIVE
      }
    },
    override: (handlers) => {
      handlers.additionalColumns = () => ({
        viewProductImage: (
          record: ProductResType,
          buttonProps: Record<string, any>
        ) => {
          return (
            <HasPermission
              requiredPermissions={[
                apiConfig.productImage.getList.permissionCode
              ]}
            >
              <ToolTip title={'Xem hình ảnh sách'}>
                <span>
                  <Button
                    onClick={() => handleOpen(record)}
                    className='border-none bg-transparent shadow-none hover:bg-transparent'
                    {...buttonProps}
                  >
                    <FileImage className='stroke-dodger-blue size-3.5' />
                  </Button>
                </span>
              </ToolTip>
            </HasPermission>
          );
        },
        recover: (
          record: ProductResType,
          buttonProps?: Record<string, any>
        ) => {
          return (
            <HasPermission
              requiredPermissions={[
                apiConfig.productVariant.recover.permissionCode
              ]}
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

  const columns: Column<ProductResType>[] = [
    {
      title: '#',
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 30
    },
    {
      title: 'Tên sách',
      dataIndex: 'name',
      width: 400,
      render: (value, record) => (
        <span
          onClick={() => {
            if (+searchParams.status === STATUS_ACTIVE) {
              navigate(
                renderListPageUrl(
                  generatePath(route.productVariant.getList.path, {
                    id: record.id
                  }),
                  serializeParams({
                    ...searchParams,
                    name: record.name,
                    productId: record.id
                  })
                )
              );
            }
          }}
          title={value}
          className={cn('block w-full truncate', {
            'text-dodger-blue cursor-pointer':
              +searchParams.status === STATUS_ACTIVE
          })}
        >
          {value}
        </span>
      )
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (value) => `${formatMoney(value)}`,
      width: 120
    },
    {
      title: 'Ngày phát hành',
      dataIndex: 'releaseDate',
      render: (value) => formatDate(value),
      width: 150
    },
    {
      title: 'Độ tuổi',
      dataIndex: 'ageRating',
      width: 150,
      render: (value) =>
        ageRatings.find((age) => age.value === value)?.label ?? '--'
    },
    {
      title: 'Ngôn ngữ',
      dataIndex: 'language',
      width: 150,
      render: (value) =>
        languageOptions.find((age) => age.value === value)?.label ?? '--'
    },
    {
      title: 'Thông số',
      dataIndex: 'metaData',
      width: 250,
      render: (value) => {
        const jsonObj = JSON.parse(value) as ProductBodyType['metaData'];
        if (typeof jsonObj === 'object') {
          return (
            <span
              title={`${jsonObj.length}cmx${jsonObj.width}cmx${jsonObj.height}cmx${jsonObj.weight}gx${jsonObj.numPage}tr`}
              className='block w-full truncate'
            >
              {jsonObj.length}cmx{jsonObj.width}cmx{jsonObj.height}cmx
              {jsonObj.weight}gx{jsonObj.numPage}tr
            </span>
          );
        }
        return '--';
      }
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      render: (value) => `${value}%`,
      width: 100,
      align: 'center'
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      width: 200,
      render: (value) => (
        <span title={value} className='block w-full truncate'>
          {value}
        </span>
      )
    },
    { title: 'Nhà xuất bản', dataIndex: ['publisher', 'name'], width: 200 },
    handlers.renderActionColumn({
      actions: {
        edit: (record: ProductResType) => record.status === STATUS_ACTIVE,
        viewProductImage: (record: ProductResType) =>
          record.status === STATUS_ACTIVE,
        recover: (record: ProductResType) => record.status === STATUS_DELETED,
        delete: (record: ProductResType) => record.status === STATUS_ACTIVE
      },
      columnProps: {
        fixed: true,
        width: 150
      }
    })
  ];

  const searchFields: SearchFormProps<ProductSearchParamType>['searchFields'] =
    [
      { key: 'name', placeholder: 'Tên sách' },
      {
        key: 'ageRating',
        placeholder: 'Độ tuổi',
        type: FieldTypes.SELECT,
        options: ageRatings
      },
      {
        key: 'categoryId',
        placeholder: 'Danh mục',
        type: FieldTypes.AUTOCOMPLETE,
        mappingData: (item: CategoryResType) => ({
          label: item.name,
          value: item.id
        }),
        apiConfig: apiConfig.category.autoComplete,
        searchParams: ['name'],
        initialParams: { status: STATUS_ACTIVE }
      },
      {
        key: 'language',
        placeholder: 'Ngôn ngữ',
        type: FieldTypes.SELECT,
        options: languageOptions
      },
      {
        key: 'publisherId',
        placeholder: 'Nhà xuất bản',
        type: FieldTypes.AUTOCOMPLETE,
        mappingData: (item: PublisherResType) => ({
          label: item.name,
          value: item.id
        }),
        apiConfig: apiConfig.publisher.autoComplete,
        searchParams: ['name'],
        initialParams: { status: STATUS_ACTIVE }
      },
      {
        key: 'status',
        placeholder: 'Trạng thái',
        type: FieldTypes.SELECT,
        options: productStatuses,
        submitOnChanged: true
      }
    ];

  const handleOpen = (record: ProductResType) => {
    open();
    setSelectedRow(record);
  };

  const handleClose = () => {
    close();
  };

  return (
    <PageWrapper breadcrumbs={[{ label: 'Sách' }]}>
      <ListPageWrapper
        searchForm={handlers.renderSearchForm({
          searchFields,
          schema: productSearchParamSchema
        })}
        reloadButton={handlers.renderReloadButton()}
        addButton={handlers.renderAddButton()}
      >
        <BaseTable
          columns={columns}
          dataSource={data || []}
          pagination={pagination}
          loading={loading}
          changePagination={handlers.changePagination}
        />
      </ListPageWrapper>
      <ProductImageModal
        data={selectedRow}
        open={opened}
        onClose={handleClose}
      />
    </PageWrapper>
  );
}
