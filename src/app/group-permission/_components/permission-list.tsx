'use client';

import { emptyData } from '@/assets';
import {
  AutoCompleteField,
  Button,
  Col,
  InputField,
  Row,
  TextAreaField,
  ToolTip
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { CircleLoading } from '@/components/loading';
import { Modal } from '@/components/modal';
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
  DEFAULT_TABLE_PAGE_START,
  MAX_PAGE_SIZE,
  permissionErrorMaps
} from '@/constants';
import { useDisclosure } from '@/hooks';
import { cn } from '@/lib';
import { logger } from '@/logger';
import { useGroupPermissionListQuery } from '@/queries';
import {
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  usePermissionListQuery,
  useUpdatePermissionMutation
} from '@/queries/permission.query';
import { permissionSchema } from '@/schemaValidations';
import { PermissionBodyType, PermissionResType } from '@/types';
import { applyFormErrors, notify } from '@/utils';
import { omit } from 'lodash';
import { Edit2, Info, Plus, Save, Trash, X } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import MediaQuery from 'react-responsive';

export default function PermissionList() {
  const { opened, open, close } = useDisclosure(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedGroupPermissionId, setSelectedGroupPermissionId] =
    useState<string>('');
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionResType | null>(null);

  const groupPermissionListQuery = useGroupPermissionListQuery({
    page: DEFAULT_TABLE_PAGE_START,
    size: MAX_PAGE_SIZE
  });

  const permissionListQuery = usePermissionListQuery({
    page: DEFAULT_TABLE_PAGE_START,
    size: MAX_PAGE_SIZE
  });
  const createPermissionMutation = useCreatePermissionMutation();
  const updatePermissionMutation = useUpdatePermissionMutation();
  const deletePermissionMutation = useDeletePermissionMutation();

  const groupPermissions = groupPermissionListQuery.data?.data.content || [];
  const permissions = permissionListQuery.data?.data.content || [];

  const loading =
    permissionListQuery.isLoading ||
    groupPermissionListQuery.isLoading ||
    permissionListQuery.isRefetching ||
    groupPermissionListQuery.isRefetching;

  const groupedPermissions = (permissions || []).reduce((acc, permission) => {
    const group = permission.permissionGroup.name || 'Unknown';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(permission);
    return acc;
  }, {} as any);

  (groupPermissions || [])
    .map((group) => group.name)
    .forEach((groupName) => {
      if (!groupedPermissions[groupName]) {
        groupedPermissions[groupName] = [];
      }
    });

  const defaultValues: PermissionBodyType = {
    name: '',
    description: '',
    permissionGroupId: '',
    pCode: ''
  };

  const initialValues = useMemo(
    () => ({
      description: selectedPermission?.description ?? '',
      name: selectedPermission?.name ?? '',
      pCode: selectedPermission?.pCode ?? '',
      permissionGroupId: selectedGroupPermissionId
    }),
    [
      selectedGroupPermissionId,
      selectedPermission?.description,
      selectedPermission?.name,
      selectedPermission?.pCode
    ]
  );

  const onSubmit = async (
    values: PermissionBodyType,
    form: UseFormReturn<PermissionBodyType>
  ) => {
    const mutation = !isEditing
      ? createPermissionMutation
      : updatePermissionMutation;
    await mutation.mutateAsync(
      !isEditing
        ? values
        : {
            ...omit(values, 'permissionGroupId'),
            id: selectedPermission?.id
          },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success(
              `${!isEditing ? 'Thêm mới' : 'Cập nhật'} quyền thành công`
            );
            handleClose();
            permissionListQuery.refetch();
          } else {
            const errCode = res.code;
            if (errCode) {
              applyFormErrors(form, errCode, permissionErrorMaps);
            } else {
              logger.error('Error while creating/updating permission:', res);
              notify.error('Có lỗi xảy ra');
            }
          }
        },
        onError: (error) => {
          logger.error('Error while creating/updating permission:', error);
          notify.error('Có lỗi xảy ra');
        }
      }
    );
  };

  const handleAdd = (group: string) => {
    setIsEditing(false);
    const groupPermission = groupPermissions.find((gp) => gp.name === group);
    setSelectedGroupPermissionId(groupPermission?.id ?? '');
    open();
  };

  const handleEdit = (record: PermissionResType) => {
    setIsEditing(true);
    open();
    setSelectedPermission(record);
    setSelectedGroupPermissionId(record.permissionGroup.id);
  };

  const handleDelete = async (record: PermissionResType) => {
    deletePermissionMutation.mutateAsync(record.id);
  };

  const handleClose = () => {
    close();
    setSelectedPermission(null);
  };

  return (
    <>
      <ListPageWrapper>
        {loading ? (
          <CircleLoading className='mt-4 size-8! stroke-slate-500' />
        ) : (
          <div className='flex flex-col gap-y-4 px-4 py-4 max-[1560px]:max-w-300'>
            {Object.keys(groupedPermissions).map((group) => {
              const permissions = groupedPermissions[group];
              return (
                <div
                  className='rounded-lg border border-solid border-gray-200 text-sm'
                  key={group}
                >
                  <div className='flex items-center justify-between border-b border-solid border-b-gray-200 py-2 pr-2 pl-4'>
                    <div className='font-semibold'>{group}</div>
                    <ToolTip sideOffset={8} title={`Thêm quyền`}>
                      <Plus
                        className='stroke-dodger-blue size-4 cursor-pointer transition-all duration-200 ease-linear hover:opacity-80'
                        onClick={() => handleAdd(group)}
                      />
                    </ToolTip>
                  </div>
                  <div
                    className={cn('grid gap-4 p-4', {
                      'grid-cols-4 max-[1560px]:grid-cols-3':
                        permissions?.length > 0
                    })}
                  >
                    {permissions?.length > 0 ? (
                      permissions.map(
                        (permission: PermissionResType, index: number) => {
                          return (
                            <div
                              className='flex items-center justify-between'
                              key={permission.id}
                            >
                              {permission.name}
                              <div className='flex items-center justify-center gap-x-4'>
                                <ToolTip title={`Sửa ${permission.name}`}>
                                  <Button
                                    className='h-5 border-none bg-transparent p-0! shadow-none hover:bg-transparent'
                                    onClick={() => handleEdit(permission)}
                                  >
                                    <Edit2 className='stroke-dodger-blue size-3.5' />
                                  </Button>
                                </ToolTip>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <span>
                                      <ToolTip title={`Xóa ${permission.name}`}>
                                        <Button className='h-5 border-none bg-transparent p-0! shadow-none hover:bg-transparent'>
                                          <Trash className='size-3.5 stroke-red-600' />
                                        </Button>
                                      </ToolTip>
                                    </span>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0! data-[state=closed]:slide-out-to-top-0! data-[state=open]:slide-in-from-left-0! data-[state=open]:slide-in-from-top-0! top-[30%]'>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className='text-md flex items-center gap-2 font-normal'>
                                        <Info className='size-8 fill-orange-500 stroke-white' />
                                        Bạn có chắc chắn muốn xóa quyền này
                                        không ?
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
                                          className='bg-dodger-blue hover:bg-dodger-blue/80 cursor-pointer transition-all duration-200 ease-linear'
                                          onClick={() =>
                                            handleDelete(permission)
                                          }
                                        >
                                          Có
                                        </Button>
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                <MediaQuery maxWidth={1560}>
                                  {(index + 1) % 3 !== 0 && (
                                    <Separator
                                      orientation='vertical'
                                      className='ml-2 h-4! bg-gray-200'
                                    />
                                  )}
                                </MediaQuery>
                                <MediaQuery minWidth={1560}>
                                  {(index + 1) % 4 !== 0 && (
                                    <Separator
                                      orientation='vertical'
                                      className='ml-2 h-4! bg-gray-200'
                                    />
                                  )}
                                </MediaQuery>
                              </div>
                            </div>
                          );
                        }
                      )
                    ) : (
                      <div className='flex w-full flex-col items-center justify-center gap-y-2'>
                        <Image
                          src={emptyData.src}
                          alt='Empty'
                          width={150}
                          height={80}
                        />
                        <p>Không có dữ liệu</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ListPageWrapper>
      <Modal open={opened} onClose={handleClose}>
        <Card className='w-175 bg-white'>
          <CardHeader className='flex flex-row items-center justify-between pb-1'>
            <CardTitle>{`${!isEditing ? 'Thêm' : 'Cập nhật'} quyền`}</CardTitle>
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
              schema={permissionSchema}
            >
              {(form) => (
                <>
                  {isEditing ? (
                    <>
                      <Row className='my-0'>
                        <Col span={12}>
                          <InputField
                            control={form.control}
                            name='name'
                            label='Tên quyền'
                            placeholder='Nhập tên quyền...'
                            required
                            labelClassName='font-normal'
                          />
                        </Col>
                        <Col span={12}>
                          <InputField
                            control={form.control}
                            name='pCode'
                            label='Mã quyền'
                            placeholder='Mã quyền...'
                            required
                            labelClassName='font-normal'
                          />
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <Row className='my-0'>
                        <Col span={12}>
                          <AutoCompleteField
                            name='permissionGroupId'
                            control={form.control}
                            options={
                              groupPermissions.map((gp) => ({
                                label: gp.name,
                                value: gp.id
                              })) || []
                            }
                            getLabel={(opt) => opt.label}
                            getValue={(opt) => opt.value}
                            label='Nhóm quyền'
                            required
                            disabled
                            placeholder='Chọn nhóm quyền'
                          />
                        </Col>
                        <Col span={12}>
                          <InputField
                            control={form.control}
                            name='name'
                            label='Tên quyền'
                            placeholder='Nhập tên quyền...'
                            required
                            labelClassName='font-normal'
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <InputField
                            control={form.control}
                            name='pCode'
                            label='Mã quyền'
                            placeholder='Mã quyền...'
                            required
                            labelClassName='font-normal'
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                  <Row>
                    <Col>
                      <TextAreaField
                        control={form.control}
                        name='description'
                        label='Mô tả'
                        placeholder='Nhập mô tả'
                        rows={5}
                        className='focus-visible:ring-dodger-blue'
                        required
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
                          createPermissionMutation.isPending ||
                          updatePermissionMutation.isPending
                        }
                        type='submit'
                        className={
                          'bg-dodger-blue hover:bg-dodger-blue hover:opacity-80 disabled:pointer-events-auto disabled:cursor-not-allowed'
                        }
                      >
                        {createPermissionMutation.isPending ||
                        updatePermissionMutation.isPending ? (
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
