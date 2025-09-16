'use client';

import { categoryApiRequest } from '@/api-requests';
import { AvatarField, Button, ToolTip } from '@/components/form';
import { HasPermission } from '@/components/has-permission';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { CircleLoading } from '@/components/loading';
import { DragDropTable } from '@/components/table';
import {
  apiConfig,
  categoryStatuses,
  FieldTypes,
  STATUS_ACTIVE,
  STATUS_DELETED
} from '@/constants';
import { useDragDrop, useListBase } from '@/hooks';
import { cn } from '@/lib';
import route from '@/routes';
import { categorySearchParamSchema } from '@/schemaValidations';
import {
  CategoryResType,
  CategorySearchParamType,
  Column,
  SearchFormProps
} from '@/types';
import { notify, renderImageUrl } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { RotateCcw, Save } from 'lucide-react';

export default function CategoryList({ queryKey }: { queryKey: string }) {
  const recoverMutation = useMutation({
    mutationKey: [`${queryKey}-recover`],
    mutationFn: (id: string) => categoryApiRequest.recover(id)
  });
  const { data, loading, queryFilter, handlers, listQuery } = useListBase<
    CategoryResType,
    CategorySearchParamType
  >({
    apiConfig: apiConfig.category,
    options: {
      queryKey,
      objectName: 'danh mục',
      defaultFilters: {
        status: STATUS_ACTIVE
      }
    },
    override: (handlers) => {
      handlers.additionalColumns = () => ({
        recover: (
          record: CategoryResType,
          buttonProps?: Record<string, any>
        ) => {
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
  const {
    sortColumn,
    loading: updateOrderingloading,
    sortedData,
    isChanged,
    onDragEnd,
    handleUpdate
  } = useDragDrop<CategoryResType>({
    key: 'category-list',
    objectName: 'danh mục',
    data,
    apiConfig: apiConfig.category.updateOrdering,
    sortField: 'ordering'
  });

  const columns: Column<CategoryResType>[] = [
    ...(sortedData.length > 1 ? [sortColumn] : []),
    {
      title: '#',
      dataIndex: 'imageUrl',
      width: 80,
      align: 'center',
      render: (value) => {
        return (
          <AvatarField
            size={50}
            className={cn('mx-auto', {
              rounded: value
            })}
            previewClassName='rounded'
            disablePreview={!value}
            src={renderImageUrl(value)}
          />
        );
      }
    },
    {
      title: 'Tên',
      dataIndex: 'name'
    },
    handlers.renderStatusColumn(),
    handlers.renderActionColumn({
      actions: {
        edit: (record: CategoryResType) => record.status === STATUS_ACTIVE,
        recover: (record: CategoryResType) => record.status === STATUS_DELETED,
        delete: (record: CategoryResType) => record.status === STATUS_ACTIVE
      }
    })
  ];

  const searchFields: SearchFormProps<CategorySearchParamType>['searchFields'] =
    [
      { key: 'name', placeholder: 'Tên danh mục' },
      {
        key: 'status',
        type: FieldTypes.SELECT,
        options: categoryStatuses,
        placeholder: 'Trạng thái',
        submitOnChanged: true
      }
    ];

  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Trang chủ', href: route.home.path },
        { label: 'Danh mục' }
      ]}
    >
      <ListPageWrapper
        searchForm={handlers.renderSearchForm({
          searchFields,
          schema: categorySearchParamSchema,
          initialValues: { ...queryFilter }
        })}
        actionBar={handlers.renderAddButton()}
      >
        <DragDropTable
          columns={columns}
          dataSource={sortedData}
          loading={loading || updateOrderingloading}
          onDragEnd={onDragEnd}
        />
        {sortedData.length > 1 && !(loading || updateOrderingloading) && (
          <div className='mr-4 flex justify-end py-4'>
            <Button
              onClick={handleUpdate}
              disabled={!isChanged || loading || updateOrderingloading}
              className='w-40'
              variant={'primary'}
            >
              {loading || updateOrderingloading ? (
                <CircleLoading />
              ) : (
                <>
                  <Save />
                  Cập nhật
                </>
              )}
            </Button>
          </div>
        )}
      </ListPageWrapper>
    </PageWrapper>
  );
}
