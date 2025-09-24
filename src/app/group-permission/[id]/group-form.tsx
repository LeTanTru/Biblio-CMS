'use client';

import { emptyData } from '@/assets';
import {
  Button,
  Col,
  InputField,
  Row,
  SelectField,
  TextAreaField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { PageWrapper } from '@/components/layout';
import { CircleLoading } from '@/components/loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DEFAULT_TABLE_PAGE_START,
  groupErrorMaps,
  groupKinds,
  MAX_PAGE_SIZE
} from '@/constants';
import { useNavigate } from '@/hooks';
import { cn } from '@/lib';
import { logger } from '@/logger';
import {
  useCreateGroupMutation,
  useGroupPermissionListQuery,
  useGroupQuery,
  usePermissionListQuery,
  useUpdateGroupMutation
} from '@/queries';
import route from '@/routes';
import { groupSchema } from '@/schemaValidations';
import { GroupBodyType, PermissionResType } from '@/types';
import { applyFormErrors, notify } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { omit } from 'lodash';
import { ArrowLeftFromLine, Save } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function GroupForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isCreate = id === 'create';
  const queryClient = useQueryClient();

  const groupQuery = useGroupQuery(id);
  const permissionListQuery = usePermissionListQuery({
    page: DEFAULT_TABLE_PAGE_START,
    size: MAX_PAGE_SIZE
  });
  const groupPermissionListQuery = useGroupPermissionListQuery({
    page: DEFAULT_TABLE_PAGE_START,
    size: MAX_PAGE_SIZE
  });

  const group = groupQuery.data?.data;
  const groupPermissions = groupPermissionListQuery.data?.data.content || [];
  const permissions = permissionListQuery.data?.data.content;

  const createGroupMutation = useCreateGroupMutation();
  const updateGroupMutation = useUpdateGroupMutation();

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

  const defaultValues: GroupBodyType = {
    kind: 1,
    name: '',
    permissionIds: [],
    description: ''
  };

  const initialValues: GroupBodyType = useMemo(
    () => ({
      description: group?.description ?? '',
      name: group?.name ?? '',
      permissionIds: group?.permissions.map((g) => g.id) ?? []
    }),
    [group?.description, group?.name, group?.permissions]
  );

  const onSubmit = async (
    values: GroupBodyType,
    form: UseFormReturn<GroupBodyType>
  ) => {
    const mutation = isCreate ? createGroupMutation : updateGroupMutation;
    await mutation.mutateAsync(
      isCreate ? values : { ...omit(values, ['kind']), id },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success(
              `${isCreate ? 'Thêm mới' : 'Cập nhật'} nhóm quyền thành công`
            );
            queryClient.invalidateQueries({ queryKey: ['group', id] });
            navigate(route.group.getList.path);
          } else {
            const errCode = res.code;
            if (errCode) {
              applyFormErrors(form, errCode, groupErrorMaps);
            } else {
              logger.error('Error while creating/updating group:', res);
              notify.error('Có lỗi xảy ra');
            }
          }
        },
        onError: (error) => {
          logger.error('Error while creating/updating group:', error);
          notify.error('Có lỗi xảy ra');
        }
      }
    );
  };

  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Nhóm quyền', href: route.group.getList.path },
        { label: `${isCreate ? 'Thêm mới' : 'Cập nhật'} quyền` }
      ]}
    >
      <BaseForm
        defaultValues={defaultValues}
        initialValues={initialValues}
        onSubmit={onSubmit}
        schema={groupSchema}
      >
        {(form) => (
          <>
            <Row>
              <Col span={12}>
                <InputField
                  control={form.control}
                  name='name'
                  label='Tên nhóm'
                  placeholder='Nhập tên nhóm'
                  required
                />
              </Col>
              {isCreate && (
                <Col span={12}>
                  <SelectField
                    getLabel={(option) => option.label}
                    getValue={(option) => option.value}
                    options={groupKinds}
                    control={form.control}
                    name='kind'
                    label='Loại'
                    placeholder='Chọn loại'
                    required
                  />
                </Col>
              )}
            </Row>
            <Row>
              <Col>
                <TextAreaField
                  control={form.control}
                  name='description'
                  label='Mô tả'
                  placeholder='Nhập mô tả'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col className='gap-y-4'>
                {Object.keys(groupedPermissions).map((gp) => {
                  const permissions = groupedPermissions[gp];
                  return (
                    <Card key={gp} className='text-sm'>
                      <CardHeader className='flex flex-row items-center gap-x-2 border-b px-4 py-2'>
                        <Checkbox
                          id={`select-all-${gp}`}
                          checked={
                            permissions.length > 0 &&
                            permissions.every((p: PermissionResType) =>
                              (form.watch('permissionIds') || []).includes(p.id)
                            )
                              ? true
                              : (form.watch('permissionIds') || []).some((id) =>
                                    permissions
                                      .map((p: PermissionResType) => p.id)
                                      .includes(id)
                                  )
                                ? 'indeterminate'
                                : false
                          }
                          onCheckedChange={(checked) => {
                            const selected = form.watch('permissionIds') || [];
                            if (checked === true) {
                              const newIds = Array.from(
                                new Set([
                                  ...selected,
                                  ...permissions.map(
                                    (p: PermissionResType) => p.id
                                  )
                                ])
                              );
                              form.setValue('permissionIds', newIds, {
                                shouldDirty: true
                              });
                            } else {
                              const newIds = selected.filter(
                                (id) =>
                                  !permissions
                                    .map((p: PermissionResType) => p.id)
                                    .includes(id)
                              );
                              form.setValue('permissionIds', newIds, {
                                shouldDirty: true
                              });
                            }
                          }}
                          className='data-[state=checked]:bg-dodger-blue [&>span[data-state=indeterminate]]:bg-dodger-blue mb-0! cursor-pointer transition-all duration-100 ease-linear data-[state=checked]:border-transparent data-[state=indeterminate]:bg-transparent [&>span[data-state=indeterminate]]:m-auto [&>span[data-state=indeterminate]]:h-1/2 [&>span[data-state=indeterminate]]:w-1/2 [&>span[data-state=indeterminate]>svg]:hidden'
                        />
                        <label
                          className='cursor-pointer select-none'
                          htmlFor={`select-all-${gp}`}
                        >
                          {gp}
                        </label>
                      </CardHeader>
                      <CardContent className='p-4'>
                        <div
                          className={cn('grid gap-4', {
                            'grid-cols-4 max-[1560px]:grid-cols-3':
                              permissions?.length > 0
                          })}
                        >
                          {permissions?.length > 0 ? (
                            permissions.map((permission: PermissionResType) => {
                              const selected =
                                form.watch('permissionIds') || [];

                              const handleToggle = (
                                checked: boolean | 'indeterminate'
                              ) => {
                                if (checked === true) {
                                  form.setValue(
                                    'permissionIds',
                                    [...selected, permission.id],
                                    {
                                      shouldDirty: true
                                    }
                                  );
                                } else {
                                  form.setValue(
                                    'permissionIds',
                                    selected.filter(
                                      (id) => id !== permission.id
                                    ),
                                    { shouldDirty: true }
                                  );
                                }
                              };

                              return (
                                <div
                                  key={permission.id}
                                  className='flex items-center gap-x-2'
                                >
                                  <Checkbox
                                    checked={selected.includes(permission.id)}
                                    onCheckedChange={handleToggle}
                                    id={permission.id}
                                    className={
                                      'data-[state=checked]:bg-dodger-blue data-[state=checked]:border-dodger-blue cursor-pointer transition-all duration-100 ease-linear data-[state=unchecked]:text-white'
                                    }
                                  />
                                  <label
                                    className='cursor-pointer select-none'
                                    htmlFor={permission.id}
                                  >
                                    {permission.name}
                                  </label>
                                </div>
                              );
                            })
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
                      </CardContent>
                    </Card>
                  );
                })}
              </Col>
            </Row>
            <Row className='my-0 justify-end'>
              <Col span={4}>
                <Button
                  onClick={() => navigate(route.group.getList.path)}
                  type='button'
                  variant={'ghost'}
                  className='border border-red-500 text-red-500 hover:border-red-500/50 hover:bg-transparent! hover:text-red-500/50'
                >
                  <ArrowLeftFromLine />
                  Hủy
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  disabled={
                    !form.formState.isDirty ||
                    createGroupMutation.isPending ||
                    updateGroupMutation.isPending
                  }
                  type='submit'
                  variant={'primary'}
                >
                  {createGroupMutation.isPending ||
                  updateGroupMutation.isPending ? (
                    <CircleLoading />
                  ) : (
                    <>
                      <Save />
                      {isCreate ? 'Thêm' : 'Cập nhật'}
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </BaseForm>
    </PageWrapper>
  );
}
