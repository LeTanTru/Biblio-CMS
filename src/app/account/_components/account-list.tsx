'use client';
import { AvatarField, Button, ToolTip } from '@/components/form';
import { HasPermission } from '@/components/has-permission';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { BaseTable } from '@/components/table';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { apiConfig, groupKinds } from '@/constants';
import { useListBase } from '@/hooks';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { accountSearchSchema } from '@/schemaValidations';
import {
  AccountResType,
  AccountSearchType,
  ApiResponse,
  Column,
  SearchFormProps
} from '@/types';
import { http, notify, renderImageUrl } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleUserRound, Info, Trash } from 'lucide-react';

export default function AccountList({ queryKey }: { queryKey: string }) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationKey: [`delete-${queryKey}`],
    mutationFn: (id: string) =>
      http.delete<ApiResponse<any>>(apiConfig.account.delete, {
        pathParams: {
          id
        }
      })
  });

  const { data, pagination, loading, handlers, listQuery } = useListBase<
    AccountResType,
    AccountSearchType
  >({
    apiConfig: apiConfig.account,
    options: {
      queryKey,
      objectName: 'tài khoản'
    },
    override: (handlers) => {
      handlers.additionalColumns = () => ({
        delete: (record: AccountResType, buttonProps?: Record<string, any>) => {
          return (
            <HasPermission
              requiredPermissions={[apiConfig.account.delete.permissionCode]}
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <span>
                    <ToolTip title={`Xóa tài khoản`}>
                      <Button
                        className='border-none bg-transparent shadow-none hover:bg-transparent'
                        disabled={record.isSuperAdmin}
                        {...buttonProps}
                      >
                        <Trash className='size-3.5 stroke-red-600' />
                      </Button>
                    </ToolTip>
                  </span>
                </AlertDialogTrigger>
                <AlertDialogContent className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0! data-[state=closed]:slide-out-to-top-0! data-[state=open]:slide-in-from-left-0! data-[state=open]:slide-in-from-top-0! top-[30%] max-w-lg p-4'>
                  <AlertDialogHeader>
                    <AlertDialogTitle className='flex items-center gap-2 text-sm font-normal'>
                      <Info className='size-8 fill-orange-500 stroke-white' />
                      Bạn có chắc chắn muốn xóa tài khoản này không ?
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button
                        variant='outline'
                        className='border-red-500 text-red-500 transition-all duration-200 ease-linear hover:bg-transparent hover:text-red-500/80'
                      >
                        Không
                      </Button>
                    </AlertDialogCancel>
                    <Button
                      variant={'primary'}
                      onClick={() => handleDelete(record)}
                    >
                      Có
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </HasPermission>
          );
        }
      });
    }
  });

  const handleDelete = async (record: AccountResType) => {
    await deleteMutation.mutateAsync(record.id, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success(`Xoá tài khoản thành công`);
          queryClient.invalidateQueries({ queryKey: [`${queryKey}-list`] });
          listQuery.refetch();
        } else {
          notify.error(`Xoá tài khoản thất bại`);
        }
      },
      onError: (error: Error) => {
        logger.error(`Error while deleting ${queryKey}: `, error);
        notify.error('Có lỗi xảy ra khi xóa');
      }
    });
  };

  const columns: Column<AccountResType>[] = [
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
            <CircleUserRound className='fill-transparent stroke-slate-800' />
          }
        />
      )
    },
    {
      title: 'Tên',
      dataIndex: 'fullName',
      render: (value) => value ?? '---'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
      render: (value) => (
        <span className='line-clamp-1' title={value}>
          {value}
        </span>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      render: (value) => value ?? '---',
      width: 150,
      align: 'center'
    },
    {
      title: 'Vai trò',
      dataIndex: 'kind',
      render: (value) => {
        const groupKind = groupKinds.find((gk) => gk.value === value);
        return (
          <Badge style={{ backgroundColor: groupKind?.color }}>
            {groupKind?.label}
          </Badge>
        );
      },
      width: 120,
      align: 'center'
    },
    handlers.renderStatusColumn(),
    handlers.renderActionColumn({
      actions: { delete: true }
    })
  ];

  const searchFields: SearchFormProps<AccountSearchType>['searchFields'] = [
    { key: 'fullName', placeholder: 'Họ tên' },
    {
      key: 'email',
      placeholder: 'Email'
    },
    {
      key: 'phone',
      placeholder: 'Số điện thoại'
    }
  ];

  return (
    <PageWrapper breadcrumbs={[{ label: 'Tài khoản' }]}>
      <ListPageWrapper
        searchForm={handlers.renderSearchForm({
          searchFields,
          schema: accountSearchSchema
        })}
        reloadButton={handlers.renderReloadButton()}
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
