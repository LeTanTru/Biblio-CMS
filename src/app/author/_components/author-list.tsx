'use client';

import { AvatarField } from '@/components/form';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { BaseTable } from '@/components/table';
import { apiConfig, FieldTypes, groupKinds } from '@/constants';
import useListBase from '@/hooks/use-list-base';
import { cn } from '@/lib';
import route from '@/routes';
import { authorSchemaParamSchema } from '@/schemaValidations';
import { Column, SearchFormProps } from '@/types';
import { AuthorResType, AuthorSearchParamType } from '@/types/author.type';
import { formatDate, renderImageUrl } from '@/utils';
import { CircleUserRound } from 'lucide-react';

export default function AuthorList() {
  const { data, pagination, loading, handlers, queryFilter } = useListBase<
    AuthorResType,
    AuthorSearchParamType
  >({
    apiConfig: apiConfig.author,
    options: {
      objectName: 'tác giả'
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
      render: (value) => value ?? '---',
      width: 150,
      align: 'center'
    },
    handlers.renderActionColumn({
      actions: { edit: true, delete: true },
      columnProps: { fixed: true }
    })
  ];

  const searchFields: SearchFormProps<AuthorSearchParamType>['searchFields'] = [
    { key: 'name', placeholder: 'Họ tên' }
  ];

  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Trang chủ', href: route.home.path },
        { label: 'Tác giả' }
      ]}
    >
      <ListPageWrapper
        searchForm={handlers.renderSearchForm({
          searchFields,
          schema: authorSchemaParamSchema,
          initialValues: { ...queryFilter, kind: null }
        })}
        actionBar={handlers.renderAddButton()}
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
