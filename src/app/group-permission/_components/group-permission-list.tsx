'use client';

import { Button, Col, InputField, Row, ToolTip } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { HasPermission } from '@/components/has-permission';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { Modal } from '@/components/modal';
import { BaseTable } from '@/components/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiConfig } from '@/constants';
import { useDisclosure, useListBase, useSaveBase } from '@/hooks';
import { groupPermissionSchema } from '@/schemaValidations';
import { Column } from '@/types';
import {
  GroupPermissionBodyType,
  GroupPermissionResType,
  GroupPermissionSearchParamType
} from '@/types/group-permission.type';
import { Edit2, PlusIcon, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function GroupPermissionList({
  queryKey
}: {
  queryKey: string;
}) {
  const { opened, open, close } = useDisclosure(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<
    GroupPermissionResType | null | undefined
  >(null);

  const {
    data: groupPermissionList,
    loading: groupPermissionListLoading,
    handlers,
    pagination,
    listQuery
  } = useListBase<GroupPermissionResType, GroupPermissionSearchParamType>({
    apiConfig: apiConfig.groupPermission,
    options: {
      queryKey,
      objectName: 'nhóm quyền'
    },
    override: (handlers) => {
      handlers.additionalColumns = () => ({
        edit: (
          record: GroupPermissionResType,
          buttonProps?: Record<string, any>
        ) => {
          return (
            <HasPermission
              requiredPermissions={[
                apiConfig.groupPermission.update.permissionCode as string
              ]}
            >
              <ToolTip title={`Sửa nhóm quyền`}>
                <span>
                  <Button
                    onClick={() => handleEditClick(record)}
                    className='border-none bg-transparent shadow-none hover:bg-transparent'
                    {...buttonProps}
                  >
                    <Edit2 className='stroke-dodger-blue size-3.5' />
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
    data: groupPermission,
    setDetailId,
    handleSubmit,
    renderActions
  } = useSaveBase<GroupPermissionResType, GroupPermissionBodyType>({
    apiConfig: apiConfig.groupPermission,
    options: {
      queryKey,
      objectName: 'nhóm quyền'
    }
  });

  const handleAdd = () => {
    setIsEditing(false);
    open();
    setSelectedRow(null);
    setDetailId('');
  };

  const handleClose = () => {
    close();
  };

  const handleEditClick = (record: GroupPermissionResType) => {
    setIsEditing(true);
    open();
    setDetailId(record.id);
  };

  useEffect(() => {
    if (groupPermission) setSelectedRow(groupPermission);
  }, [groupPermission]);

  const columns: Column<GroupPermissionResType>[] = [
    {
      title: 'Tên',
      dataIndex: 'name'
    },
    handlers.renderActionColumn({
      actions: {
        edit: true,
        delete: true
      }
    })
  ];

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
    await handleSubmit(
      !isEditing ? values : { ...values, id: selectedRow?.id }
    );
    listQuery.refetch();
    handleClose();
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
          dataSource={groupPermissionList}
          pagination={pagination}
          loading={groupPermissionListLoading}
          changePagination={handlers.changePagination}
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
              className='w-full p-0'
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
                  <div className='mt-4'>
                    {renderActions(form, {
                      onCancel: handleClose
                    })}
                  </div>
                </>
              )}
            </BaseForm>
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}
