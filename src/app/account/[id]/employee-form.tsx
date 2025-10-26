'use client';

import {
  Col,
  DatePickerField,
  InputField,
  Row,
  SelectField,
  UploadImageField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import PasswordField from '@/components/form/password-field';
import { PageWrapper } from '@/components/layout';
import { CircleLoading } from '@/components/loading';
import { apiConfig, GROUP_KIND_EMPLOYEE } from '@/constants';
import { useSaveBase } from '@/hooks';
import { useGroupListQuery, useUploadAvatar } from '@/queries';
import route from '@/routes';
import { accountSchema } from '@/schemaValidations';
import { AccountBodyType, AccountResType } from '@/types';
import { renderImageUrl } from '@/utils';
import { useEffect, useMemo, useState } from 'react';

export default function EmployeeForm({ queryKey }: { queryKey: string }) {
  const [avatarPath, setAvatarPath] = useState<string>('');
  const groupListQuery = useGroupListQuery();
  const groupList = groupListQuery.data?.data.content || [];
  const groupOptions = groupList.map((item) => ({
    label: item.name,
    value: item.id
  }));
  const { data, loading, handleSubmit, renderActions } = useSaveBase<
    AccountResType,
    AccountBodyType
  >({
    apiConfig: {
      create: apiConfig.account.createEmployee,
      update: apiConfig.account.updateEmployee,
      getById: apiConfig.account.getById
    },
    options: {
      queryKey,
      objectName: 'tài khoản nhân viên',
      listPageUrl: route.account.getList.path
    }
  });
  const uploadImageMutation = useUploadAvatar();

  const defaultValues: AccountBodyType = {
    email: '',
    fullName: '',
    groupId: '',
    password: '',
    phone: '',
    avatarPath: ''
  };

  const initialValues: AccountBodyType = useMemo(() => {
    return {
      email: data?.email ?? '',
      fullName: data?.fullName ?? '',
      groupId:
        groupList.find((group) => group.kind === GROUP_KIND_EMPLOYEE)?.id ?? '',
      password: '',
      phone: data?.phone ?? '',
      avatarPath: data?.avatarPath ?? ''
    };
  }, [data?.avatarPath, data?.email, data?.fullName, data?.phone, groupList]);

  useEffect(() => {
    if (data?.avatarPath) setAvatarPath(data?.avatarPath);
  }, [data]);

  const onSubmit = async (values: AccountBodyType) => {
    await handleSubmit({ ...values, avatarPath: avatarPath });
  };

  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Tài khoản', href: route.account.getList.path },
        { label: `${!data ? 'Thêm mới' : 'Cập nhật'} nhân viên` }
      ]}
    >
      <BaseForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        schema={accountSchema}
        initialValues={initialValues}
        className='w-250'
      >
        {(form) => (
          <>
            <Row>
              <Col>
                <UploadImageField
                  value={renderImageUrl(avatarPath)}
                  loading={uploadImageMutation.isPending}
                  control={form.control}
                  name='avatarPath'
                  onChange={(url) => {
                    setAvatarPath(url);
                  }}
                  size={100}
                  uploadImageFn={async (file: Blob) => {
                    const res = await uploadImageMutation.mutateAsync({ file });
                    return res.data?.filePath ?? '';
                  }}
                  label='Tải ảnh lên'
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <InputField
                  control={form.control}
                  name='fullName'
                  label='Họ tên nhân viên'
                  placeholder='Họ tên nhân viên'
                  required
                />
              </Col>
              <Col span={12}>
                <InputField
                  control={form.control}
                  name='email'
                  label='Email'
                  placeholder='Email'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <InputField
                  control={form.control}
                  name='phone'
                  label='Số điện thoại'
                  placeholder='Số điện thoại'
                  required
                />
              </Col>
              <Col span={12}>
                <PasswordField
                  control={form.control}
                  name='password'
                  label='Mật khẩu'
                  placeholder='Mật khẩu'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <SelectField
                  getLabel={(opt) => opt.label}
                  getValue={(opt) => opt.value}
                  options={groupOptions || []}
                  control={form.control}
                  name='groupId'
                  label='Nhóm quyền'
                  placeholder='Nhóm quyền'
                  required
                />
              </Col>
            </Row>
            <>{renderActions(form)}</>
            {loading && (
              <div className='absolute inset-0 bg-white/80'>
                <CircleLoading className='stroke-dodger-blue mt-20 size-8' />
              </div>
            )}
          </>
        )}
      </BaseForm>
    </PageWrapper>
  );
}
