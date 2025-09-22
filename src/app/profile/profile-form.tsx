'use client';

import {
  Button,
  Col,
  InputField,
  Row,
  UploadImageField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { CircleLoading } from '@/components/loading';
import { storageKeys } from '@/constants';
import { useNavigate } from '@/hooks';
import { logger } from '@/logger';
import { useUpdateProfileMutation, useUploadAvatar } from '@/queries';
import route from '@/routes';
import { updateProfileSchema } from '@/schemaValidations';
import { useAuthStore } from '@/store';
import { ProfileBodyType } from '@/types';
import { getData, notify, removeData, renderImageUrl } from '@/utils';
import { Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function ProfileForm() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const fileMutation = useUploadAvatar();
  const profileMutation = useUpdateProfileMutation();
  const [avatarPath, setAvatarPath] = useState('');

  const defaultValues: ProfileBodyType = {
    email: '',
    fullName: '',
    avatarPath: '',
    phone: ''
  };

  const initialValues: ProfileBodyType = useMemo(
    () => ({
      email: profile?.email ?? '',
      fullName: profile?.fullName ?? '',
      avatarPath: profile?.avatarPath ?? '',
      phone: profile?.phone ?? ''
    }),
    [profile?.avatarPath, profile?.email, profile?.fullName, profile?.phone]
  );

  useEffect(() => {
    if (profile?.avatarPath) setAvatarPath(profile?.avatarPath);
  }, [profile?.avatarPath]);

  const onSubmit = async (
    values: ProfileBodyType,
    form: UseFormReturn<ProfileBodyType>
  ) => {
    await profileMutation.mutateAsync(
      { ...values, avatarPath },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Cập nhật hồ sơ thành công');
          } else {
            notify.error('Cập nhật hồ sơ thất bại');
          }
        },
        onError: (error) => {
          logger.error('Error while updating profile: ', error);
          notify.error('Cập nhật hồ sơ thất bại');
        }
      }
    );
  };

  const handleCancel = () => {
    const prevPath = getData(storageKeys.PREVIOUS_PATH);
    removeData(storageKeys.PREVIOUS_PATH);
    navigate(prevPath ?? route.home.path);
  };

  return (
    <BaseForm
      defaultValues={defaultValues}
      initialValues={initialValues}
      onSubmit={onSubmit}
      schema={updateProfileSchema}
      className='mx-auto w-1/2'
    >
      {(form) => (
        <>
          <Row>
            <Col>
              <UploadImageField
                value={renderImageUrl(avatarPath)}
                loading={fileMutation.isPending}
                name='avatarPath'
                control={form.control}
                onChange={(url) => {
                  setAvatarPath(url);
                }}
                size={100}
                uploadImageFn={async (file: Blob) => {
                  const res = await fileMutation.mutateAsync({
                    file
                  });
                  return res.data?.filePath ?? '';
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputField
                control={form.control}
                name='email'
                label='Email'
                placeholder='Nhập email'
                required
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputField
                control={form.control}
                name='fullName'
                label='Họ tên'
                placeholder='Nhập họ tên'
                required
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputField
                control={form.control}
                name='phone'
                label='Số điện thoại'
                placeholder='Nhập số điện thoại'
                required
              />
            </Col>
          </Row>
          <Row className='my-0 justify-end'>
            <Col span={4}>
              <Button
                onClick={() => handleCancel()}
                type='button'
                variant={'ghost'}
                className='border border-red-500 text-red-500 hover:border-red-500/50 hover:bg-transparent! hover:text-red-500/50'
              >
                Hủy
              </Button>
            </Col>
            <Col span={4}>
              <Button
                disabled={!form.formState.isDirty || profileMutation.isPending}
                variant={'primary'}
              >
                {profileMutation.isPending ? (
                  <CircleLoading />
                ) : (
                  <>
                    <Save />
                    Cập nhật
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </BaseForm>
  );
}
