'use client';

import { AvatarField, Button, ToolTip } from '@/components/form';
import { HasPermission } from '@/components/has-permission';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { BaseTable } from '@/components/table';
import {
  apiConfig,
  contributorStatuses,
  FieldTypes,
  STATUS_ACTIVE,
  STATUS_DELETED
} from '@/constants';
import { useListBase } from '@/hooks';
import { cn } from '@/lib';
import { publisherSearchSchema } from '@/schemaValidations';
import {
  ApiResponse,
  Column,
  PublisherResType,
  PublisherSearchType,
  SearchFormProps
} from '@/types';
import { http, notify, renderImageUrl } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { CircleUserRound, RotateCcw } from 'lucide-react';

export default function PublisherList({ queryKey }: { queryKey: string }) {
  const recoverMutation = useMutation({
    mutationKey: [`${queryKey}-recover`],
    mutationFn: (id: string) =>
      http.put<ApiResponse<any>>(apiConfig.publisher.recover, {
        pathParams: {
          id
        }
      })
  });

  const { data, pagination, loading, handlers, listQuery } = useListBase<
    PublisherResType,
    PublisherSearchType
  >({
    apiConfig: apiConfig.publisher,
    options: {
      queryKey,
      objectName: 'nhà xuất bản',
      defaultFilters: {
        status: STATUS_ACTIVE
      }
    },
    override: (handlers) => {
      handlers.additionalColumns = () => ({
        recover: (
          record: PublisherResType,
          buttonProps?: Record<string, any>
        ) => {
          return (
            <HasPermission
              requiredPermissions={[apiConfig.publisher.recover.permissionCode]}
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

  const columns: Column<PublisherResType>[] = [
    {
      title: '#',
      dataIndex: 'logoPath',
      width: 80,
      align: 'center',
      render: (value) => (
        <AvatarField
          size={50}
          className={cn('mx-auto rounded-full', {
            rounded: value
          })}
          previewClassName='rounded'
          disablePreview={!value}
          src={renderImageUrl(value)}
          icon={
            <CircleUserRound className='size-8 fill-transparent stroke-slate-800' />
          }
        />
      )
    },
    {
      title: 'Tên nhà xuất bản',
      dataIndex: 'name',
      render: (value) => value ?? '---'
    },
    handlers.renderActionColumn({
      actions: {
        edit: (record: PublisherResType) => record.status === STATUS_ACTIVE,
        recover: (record: PublisherResType) => record.status === STATUS_DELETED,
        delete: (record: PublisherResType) => record.status === STATUS_ACTIVE
      }
    })
  ];

  const searchFields: SearchFormProps<PublisherSearchType>['searchFields'] = [
    { key: 'name', placeholder: 'Tên nhà xuất bản' },
    {
      key: 'status',
      type: FieldTypes.SELECT,
      options: contributorStatuses,
      placeholder: 'Trạng thái',
      submitOnChanged: true
    }
  ];

  return (
    <PageWrapper breadcrumbs={[{ label: 'Nhà xuất bản' }]}>
      <ListPageWrapper
        searchForm={handlers.renderSearchForm({
          searchFields,
          schema: publisherSearchSchema
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
