'use client';

import {
  AvatarField,
  Button,
  Col,
  InputField,
  Row,
  ToolTip
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { BaseTable } from '@/components/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  DEFAULT_TABLE_PAGE_SIZE,
  DEFAULT_TABLE_PAGE_START,
  groupKinds,
  statusOptions
} from '@/constants';
import { useAuth, useQueryParams } from '@/hooks';
import { cn } from '@/lib';
import { useAccountListQuery, useDeleteAccountMutation } from '@/queries';
import route from '@/routes';
import { accountSearchParamSchema } from '@/schemaValidations';
import {
  AccountResType,
  AccountSearchParamType,
  Column,
  PaginationType
} from '@/types';
import { renderImageUrl } from '@/utils';
import {
  BrushCleaning,
  CircleUserRound,
  Info,
  Search,
  Trash
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function AccountList() {
  const { profile } = useAuth();
  const [queryFilter, setQueryFilter] = useState<AccountSearchParamType>({
    page: DEFAULT_TABLE_PAGE_START,
    size: DEFAULT_TABLE_PAGE_SIZE
  });
  const { searchParams, setQueryParams } =
    useQueryParams<AccountSearchParamType>();
  const [pagination, setPagination] = useState<PaginationType>({
    current: DEFAULT_TABLE_PAGE_START + 1,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
    total: 0
  });

  const accountListQuery = useAccountListQuery(queryFilter);
  const deleteAccountMutation = useDeleteAccountMutation();

  useEffect(() => {
    setPagination((p) => ({
      ...p,
      total: accountListQuery.data?.data.totalPages ?? 0
    }));
  }, [accountListQuery.data]);

  const handleDelete = async (record: AccountResType) => {
    deleteAccountMutation.mutateAsync(record.id);
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
      width: 180,
      render: (value) => <span className='line-clamp-1'>{value}</span>
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
    {
      title: 'Trạng thái',
      width: 150,
      dataIndex: 'status',
      align: 'center',
      render: (value) => {
        const status = statusOptions.find((st) => st.value === value);
        return (
          <Badge
            className='text-sm font-normal'
            style={{ backgroundColor: status?.color }}
          >
            {status?.label}
          </Badge>
        );
      }
    },
    {
      title: 'Hành động',
      align: 'center',
      width: 120,
      render: (_, record) => {
        return (
          <div className='flex items-center justify-center'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <span>
                  <ToolTip title='Xóa tài khoản'>
                    <Button
                      disabled={
                        profile?.id === record.id || profile?.isSuperAdmin
                      }
                      className='border-none bg-transparent shadow-none hover:bg-transparent disabled:pointer-events-auto disabled:cursor-not-allowed'
                    >
                      <Trash className='size-3.5 stroke-red-600' />
                    </Button>
                  </ToolTip>
                </span>
              </AlertDialogTrigger>
              <AlertDialogContent className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0! data-[state=closed]:slide-out-to-top-0! data-[state=open]:slide-in-from-left-0! data-[state=open]:slide-in-from-top-0! top-[30%]'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-md flex items-center gap-2 font-normal'>
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
                  <AlertDialogAction asChild>
                    <Button
                      onClick={() => handleDelete(record)}
                      className='bg-dodger-blue hover:bg-dodger-blue/80 cursor-pointer transition-all duration-200 ease-linear'
                    >
                      Có
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      }
    }
  ];

  const handleChangePagination = (page: number) => {
    setQueryFilter({ ...queryFilter, page: page - 1 });
    setPagination({ ...pagination, current: page });
    setQueryParams({ ...searchParams, page: page });
  };

  const defaultValues: AccountSearchParamType = {
    fullName: '',
    email: '',
    isSuperAdmin: false,
    kind: 0,
    phone: ''
  };

  const initialValues = useMemo(() => searchParams, []);

  const onSubmit = async (values: AccountSearchParamType) => {
    const filtered = Object.entries(values).filter(
      ([, value]) =>
        value !== null && value !== undefined && value.toString().trim() !== ''
    );
    setQueryFilter({ ...queryFilter, ...Object.fromEntries(filtered) });
    setQueryParams({ ...searchParams, ...Object.fromEntries(filtered) });
  };

  const handleReset = (form: UseFormReturn<AccountSearchParamType>) => {
    form.reset();
    setQueryFilter({
      page: DEFAULT_TABLE_PAGE_START,
      size: DEFAULT_TABLE_PAGE_SIZE
    });
    setPagination({
      current: DEFAULT_TABLE_PAGE_START + 1,
      pageSize: DEFAULT_TABLE_PAGE_SIZE,
      total: 0
    });
    setQueryParams({});
  };

  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Trang chủ', href: route.home.path },
        { label: 'Tài khoản' }
      ]}
    >
      <ListPageWrapper
        searchForm={
          <BaseForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            schema={accountSearchParamSchema}
            initialValues={initialValues}
          >
            {(form) => (
              <>
                <Row className='gap-2'>
                  <Col span={4}>
                    <InputField
                      control={form.control}
                      name='fullName'
                      placeholder='Họ tên'
                      className='focus-visible:ring-dodger-blue'
                    />
                  </Col>
                  <Col span={4}>
                    <InputField
                      control={form.control}
                      name='email'
                      placeholder='Email'
                      className='focus-visible:ring-dodger-blue'
                    />
                  </Col>
                  <Col span={4}>
                    <InputField
                      control={form.control}
                      name='phone'
                      placeholder='Số điện thoại'
                      className='focus-visible:ring-dodger-blue'
                    />
                  </Col>
                  <Col className='w-9'>
                    <Button
                      type='submit'
                      className='bg-dodger-blue hover:bg-dodger-blue/80'
                    >
                      <Search />
                    </Button>
                  </Col>
                  <Col className='w-9'>
                    <Button
                      type='button'
                      onClick={() => handleReset(form)}
                      className='hover:[&>svg]:stroke-dodger-blue hover:border-dodger-blue border border-gray-300 bg-white hover:bg-transparent [&>svg]:stroke-black'
                    >
                      <BrushCleaning className='transition-all duration-200 ease-linear' />
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </BaseForm>
        }
      >
        <BaseTable
          columns={columns}
          dataSource={accountListQuery.data?.data.content || []}
          pagination={pagination}
          loading={accountListQuery.isLoading || accountListQuery.isFetching}
          changePagination={handleChangePagination}
        />
      </ListPageWrapper>
    </PageWrapper>
  );
}
