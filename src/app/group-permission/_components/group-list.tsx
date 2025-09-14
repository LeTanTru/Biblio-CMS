'use client';

import {
  AutoCompleteField,
  Button,
  Col,
  InputField,
  Row,
  ToolTip
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { HasPermission } from '@/components/has-permission';
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
import { Separator } from '@/components/ui/separator';
import {
  apiConfig,
  DEFAULT_TABLE_PAGE_SIZE,
  DEFAULT_TABLE_PAGE_START,
  groupKinds
} from '@/constants';
import { useNavigate, useQueryParams } from '@/hooks';
import { useDeleteGroupMutation, useGroupListQuery } from '@/queries';
import route from '@/routes';
import { groupSearchParamSchema } from '@/schemaValidations';
import {
  Column,
  GroupResType,
  GroupSearchParamType,
  PaginationType
} from '@/types';
import {
  BrushCleaning,
  Edit2,
  Info,
  PlusIcon,
  Search,
  Trash
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function GroupList() {
  const navigate = useNavigate();
  const [queryFilter, setQueryFilter] = useState<GroupSearchParamType>({
    page: DEFAULT_TABLE_PAGE_START,
    size: DEFAULT_TABLE_PAGE_SIZE
  });
  const { searchParams, setQueryParams } =
    useQueryParams<GroupSearchParamType>();
  const [pagination, setPagination] = useState<PaginationType>({
    current: DEFAULT_TABLE_PAGE_START + 1,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
    total: 0
  });
  const groupListQuery = useGroupListQuery(queryFilter);
  const deleteGroupMutation = useDeleteGroupMutation();

  const handleEdit = (id: string) => {
    navigate(`${route.group.getList.path}/${id}`);
  };

  const handleDelete = async (record: GroupResType) => {
    deleteGroupMutation.mutateAsync(record.id);
  };

  const columns: Column<GroupResType>[] = [
    {
      title: 'Tên',
      dataIndex: 'name'
    },
    {
      title: 'Nhóm',
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
      title: 'Hành động',
      align: 'center',
      width: 120,
      render: (_, record) => {
        return (
          <div className='flex items-center justify-center'>
            <ToolTip title='Sửa quyền'>
              <Button
                onClick={() => handleEdit(record.id)}
                className='border-none bg-transparent shadow-none hover:bg-transparent'
              >
                <Edit2 className='stroke-dodger-blue size-3.5' />
              </Button>
            </ToolTip>
            <Separator orientation='vertical' className='h-4! bg-gray-200' />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <span>
                  <ToolTip title='Xóa quyền'>
                    <Button className='border-none bg-transparent shadow-none hover:bg-transparent'>
                      <Trash className='size-3.5 stroke-red-600' />
                    </Button>
                  </ToolTip>
                </span>
              </AlertDialogTrigger>
              <AlertDialogContent className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0! data-[state=closed]:slide-out-to-top-0! data-[state=open]:slide-in-from-left-0! data-[state=open]:slide-in-from-top-0! top-[30%]'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-md flex items-center gap-2 font-normal'>
                    <Info className='size-8 fill-orange-500 stroke-white' />
                    Bạn có chắc chắn muốn xóa quyền này không ?
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

  useEffect(() => {
    setPagination((p) => ({
      ...p,
      total: groupListQuery.data?.data.totalPages ?? 0
    }));
  }, [groupListQuery.data]);

  const handleChangePagination = (page: number) => {
    setQueryFilter({ ...queryFilter, page: page - 1 });
    setPagination({ ...pagination, current: page });
    setQueryParams({ ...searchParams, page: page });
  };

  const defaultValues: GroupSearchParamType = {
    name: '',
    kind: ''
  };

  const initialValues = useMemo(() => searchParams, []);

  const onSubmit = async (values: GroupSearchParamType) => {
    const filtered = Object.entries(values).filter(
      ([, value]) =>
        value !== null && value !== undefined && value.toString().trim() !== ''
    );
    setQueryFilter({ ...queryFilter, ...Object.fromEntries(filtered) });
    setQueryParams({ ...searchParams, ...Object.fromEntries(filtered) });
  };

  const handleReset = (form: UseFormReturn<GroupSearchParamType>) => {
    form.reset(defaultValues);
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
    <ListPageWrapper
      actionBar={
        <HasPermission
          requiredPermissions={[apiConfig.group.create.permissionCode]}
        >
          <Link href={`${route.group.getList.path}/create`}>
            <Button className='bg-dodger-blue hover:bg-dodger-blue/80 font-normal'>
              <PlusIcon />
              Thêm mới
            </Button>
          </Link>
        </HasPermission>
      }
      searchForm={
        <BaseForm
          defaultValues={defaultValues}
          initialValues={initialValues}
          onSubmit={onSubmit}
          schema={groupSearchParamSchema}
        >
          {(form) => (
            <>
              <Row className='gap-2'>
                <Col span={4}>
                  <InputField
                    control={form.control}
                    name='name'
                    placeholder='Tên quyền'
                    className='focus-visible:ring-dodger-blue'
                  />
                </Col>
                <Col span={4}>
                  <AutoCompleteField
                    control={form.control}
                    name='kind'
                    placeholder='Quyền'
                    className='focus-visible:ring-dodger-blue'
                    options={groupKinds}
                    getLabel={(opt) => opt.label}
                    getValue={(opt) => String(opt.value)}
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
        dataSource={groupListQuery.data?.data.content || []}
        pagination={pagination}
        loading={groupListQuery.isLoading || groupListQuery.isFetching}
        changePagination={handleChangePagination}
      />
    </ListPageWrapper>
  );
}
