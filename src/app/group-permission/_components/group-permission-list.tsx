'use client';

import { Button, Col, InputField, Row, ToolTip } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { HasPermission } from '@/components/has-permission';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { CircleLoading } from '@/components/loading';
import { Modal } from '@/components/modal';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  apiConfig,
  DEFAULT_TABLE_PAGE_SIZE,
  DEFAULT_TABLE_PAGE_START,
  groupPermissionErrorMaps
} from '@/constants';
import { useDisclosure, useQueryParams } from '@/hooks';
import { logger } from '@/logger';
import {
  useCreateGroupPermissionMutation,
  useDeleteGroupPermissionMutation,
  useGroupPermissionListQuery,
  useUpdateGroupPermissionMutation
} from '@/queries';
import { groupPermissionSchema } from '@/schemaValidations';
import { Column, PaginationType } from '@/types';
import {
  GroupPermissionBodyType,
  GroupPermissionResType,
  GroupPermissionSearchParamType
} from '@/types/group-permission.type';
import { applyFormErrors, notify } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Edit2, Info, PlusIcon, Save, Trash, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function GroupPermissionList() {
  const [queryFilter, setQueryFilter] =
    useState<GroupPermissionSearchParamType>({
      page: DEFAULT_TABLE_PAGE_START,
      size: DEFAULT_TABLE_PAGE_SIZE
    });
  const { searchParams, setQueryParams } =
    useQueryParams<GroupPermissionSearchParamType>();
  const [pagination, setPagination] = useState<PaginationType>({
    current: DEFAULT_TABLE_PAGE_START + 1,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
    total: 0
  });
  const queryClient = useQueryClient();
  const { opened, open, close } = useDisclosure(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<GroupPermissionResType | null>(
    null
  );

  const groupPermissionListQuery = useGroupPermissionListQuery(queryFilter);
  const createGroupPermissionMutation = useCreateGroupPermissionMutation();
  const updateGroupPermissionMutation = useUpdateGroupPermissionMutation();
  const deleteGroupPermissionMutation = useDeleteGroupPermissionMutation();

  const handleAdd = () => {
    setIsEditing(false);
    open();
  };

  const handleEdit = (record: GroupPermissionResType) => {
    setIsEditing(true);
    open();
    setSelectedRow(record);
  };

  const handleDelete = async (record: GroupPermissionResType) => {
    deleteGroupPermissionMutation.mutateAsync(record.id);
  };

  const handleClose = () => {
    close();
  };

  const columns: Column<GroupPermissionResType>[] = [
    {
      title: 'Tên',
      dataIndex: 'name'
    },
    {
      title: 'Hành động',
      align: 'center',
      width: 120,
      render: (_, record) => {
        return (
          <div className='flex items-center justify-center'>
            <ToolTip title='Sửa nhóm quyền'>
              <Button
                onClick={() => handleEdit(record)}
                className='border-none bg-transparent shadow-none hover:bg-transparent'
              >
                <Edit2 className='stroke-dodger-blue size-3.5' />
              </Button>
            </ToolTip>
            <Separator orientation='vertical' className='h-4! bg-gray-200' />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <span>
                  <ToolTip title='Xóa nhóm quyền'>
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
                    Bạn có chắc chắn muốn xóa nhóm quyền này không ?
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
                      variant={'primary'}
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
      total: groupPermissionListQuery.data?.data.totalPages ?? 0
    }));
  }, [groupPermissionListQuery.data]);

  const handleChangePagination = (page: number) => {
    setQueryFilter({ ...queryFilter, page: page - 1 });
    setPagination({ ...pagination, current: page });
    setQueryParams({ ...searchParams, page: page });
  };

  const defaultValues: GroupPermissionBodyType = { name: '' };
  const initialValues: GroupPermissionBodyType = useMemo(
    () => ({
      name: selectedRow?.name || ''
    }),
    [selectedRow?.name]
  );

  const onSubmit = async (
    values: GroupPermissionBodyType,
    form: UseFormReturn<GroupPermissionBodyType>
  ) => {
    const mutation = !isEditing
      ? createGroupPermissionMutation
      : updateGroupPermissionMutation;
    await mutation.mutateAsync(
      !isEditing ? values : { ...values, id: selectedRow?.id },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success(
              `${!isEditing ? 'Thêm mới' : 'Cập nhật'} nhóm quyền thành công`
            );
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['group', values.id] });
            queryClient.invalidateQueries({ queryKey: ['group-list'] });
            groupPermissionListQuery.refetch();
          } else {
            const errCode = res.code;
            if (errCode) {
              applyFormErrors(form, errCode, groupPermissionErrorMaps);
            } else {
              logger.error(
                'Error while creating/updating group permission:',
                res
              );
              notify.error('Có lỗi xảy ra');
            }
          }
        },
        onError: (error) => {
          logger.error(
            'Error while creating/updating group permission:',
            error
          );
          notify.error('Có lỗi xảy ra');
        }
      }
    );
  };

  return (
    <>
      <ListPageWrapper
        actionBar={
          <HasPermission
            requiredPermissions={[
              apiConfig.groupPermission.create.permissionCode
            ]}
          >
            <Button onClick={handleAdd} variant={'primary'}>
              <PlusIcon />
              Thêm mới
            </Button>
          </HasPermission>
        }
      >
        <BaseTable
          columns={columns}
          dataSource={groupPermissionListQuery.data?.data.content || []}
          pagination={pagination}
          loading={
            groupPermissionListQuery.isLoading ||
            groupPermissionListQuery.isFetching
          }
          changePagination={handleChangePagination}
        />
      </ListPageWrapper>
      <Modal open={opened} onClose={handleClose}>
        <Card className='w-175 bg-white'>
          <CardHeader className='flex flex-row items-center justify-between pb-1'>
            <CardTitle>{`${!isEditing ? 'Thêm' : 'Cập nhật'} nhóm quyền`}</CardTitle>
            <X
              onClick={handleClose}
              className='cursor-pointer transition-all duration-200 ease-linear hover:opacity-80'
            />
          </CardHeader>
          <CardContent>
            <BaseForm
              defaultValues={defaultValues}
              initialValues={initialValues}
              onSubmit={onSubmit}
              schema={groupPermissionSchema}
            >
              {(form) => (
                <>
                  <Row className='my-0'>
                    <Col>
                      <InputField
                        control={form.control}
                        name='name'
                        label='Tên nhóm quyền'
                        placeholder='Nhập tên nhóm quyền...'
                        required
                        labelClassName='font-normal'
                      />
                    </Col>
                  </Row>
                  <Row className='mb-0 justify-end'>
                    <Col span={4}>
                      <Button
                        onClick={handleClose}
                        type='button'
                        variant={'ghost'}
                        className='border border-red-500 text-red-500 hover:border-red-500/50 hover:bg-transparent! hover:text-red-500/50'
                      >
                        Hủy
                      </Button>
                    </Col>
                    <Col span={4}>
                      <Button
                        disabled={
                          !form.formState.isDirty ||
                          createGroupPermissionMutation.isPending ||
                          updateGroupPermissionMutation.isPending
                        }
                        type='submit'
                        variant={'primary'}
                      >
                        {createGroupPermissionMutation.isPending ||
                        updateGroupPermissionMutation.isPending ? (
                          <CircleLoading />
                        ) : (
                          <>
                            <Save />
                            {!isEditing ? 'Thêm' : 'Cập nhật'}
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </BaseForm>
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}
