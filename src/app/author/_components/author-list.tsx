'use client';

import { AvatarField, Button, ToolTip } from '@/components/form';
import { HasPermission } from '@/components/has-permission';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { BaseTable } from '@/components/table';
import {
  apiConfig,
  contributorStatuses,
  countryOptions,
  FieldTypes,
  STATUS_ACTIVE,
  STATUS_DELETED
} from '@/constants';
import { useListBase } from '@/hooks';
import { cn } from '@/lib';
import { authorSchemaParamSchema } from '@/schemaValidations';
import {
  ApiResponse,
  AuthorResType,
  AuthorSearchParamType,
  Column,
  SearchFormProps
} from '@/types';
import { formatDate, http, notify, renderImageUrl } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { CircleUserRound, RotateCcw } from 'lucide-react';

export default function AuthorList({ queryKey }: { queryKey: string }) {
  const recoverMutation = useMutation({
    mutationKey: [`${queryKey}-recover`],
    mutationFn: (id: string) =>
      http.put<ApiResponse<any>>(apiConfig.author.recover, {
        pathParams: {
          id
        }
      })
  });

  const { data, pagination, loading, handlers, listQuery } = useListBase<
    AuthorResType,
    AuthorSearchParamType
  >({
    apiConfig: apiConfig.author,
    options: {
      queryKey,
      objectName: 'tác giả',
      defaultFilters: {
        status: STATUS_ACTIVE
      }
    },
    override: (handlers) => {
      handlers.additionalColumns = () => ({
        recover: (record: AuthorResType, buttonProps?: Record<string, any>) => {
          return (
            <HasPermission
              requiredPermissions={[apiConfig.author.recover.permissionCode]}
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

  const columns: Column<AuthorResType>[] = [
    {
      title: '#',
      dataIndex: 'avatarPath',
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
      title: 'Tên',
      dataIndex: 'name',
      render: (value) => value ?? '---'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      width: 120,
      align: 'center',
      render: (value) => (
        <span className='line-clamp-1'>{formatDate(value)}</span>
      )
    },
    {
      title: 'Quốc tịch',
      dataIndex: 'country',
      render: (value) =>
        countryOptions.find((ctr) => ctr.value === value)?.label ?? '---',
      width: 150,
      align: 'center'
    },
    handlers.renderActionColumn({
      actions: {
        edit: (record: AuthorResType) => record.status === STATUS_ACTIVE,
        recover: (record: AuthorResType) => record.status === STATUS_DELETED,
        delete: (record: AuthorResType) => record.status === STATUS_ACTIVE
      }
    })
  ];

  const searchFields: SearchFormProps<AuthorSearchParamType>['searchFields'] = [
    { key: 'name', placeholder: 'Họ tên' },
    {
      key: 'status',
      type: FieldTypes.SELECT,
      options: contributorStatuses,
      placeholder: 'Trạng thái',
      submitOnChanged: true
    }
  ];

  return (
    <PageWrapper breadcrumbs={[{ label: 'Tác giả' }]}>
      <ListPageWrapper
        searchForm={handlers.renderSearchForm({
          searchFields,
          schema: authorSchemaParamSchema
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
