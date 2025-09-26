'use client';

import {
  Col,
  DatePickerField,
  InputField,
  RichTextField,
  Row,
  SelectField,
  UploadImageField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { PageWrapper } from '@/components/layout';
import { CircleLoading } from '@/components/loading';
import {
  apiConfig,
  countryOptions,
  GENDER_MALE,
  genderOptions
} from '@/constants';
import { useSaveBase } from '@/hooks';
import { useUploadAvatar } from '@/queries';
import route from '@/routes';
import { authorSchema } from '@/schemaValidations';
import { AuthorBodyType, AuthorResType } from '@/types';
import { renderImageUrl } from '@/utils';
import { useEffect, useState } from 'react';

export default function AuthorForm({ queryKey }: { queryKey: string }) {
  const [avatarPath, setAvatarPath] = useState<string>('');
  const { data, loading, handleSubmit, renderActions } = useSaveBase<
    AuthorResType,
    AuthorBodyType
  >({
    apiConfig: apiConfig.author,
    options: {
      queryKey,
      objectName: 'tác giả',
      listPageUrl: route.author.getList.path
    }
  });
  const uploadImageMutation = useUploadAvatar();

  const defaultValues: AuthorBodyType = {
    avatarPath: '',
    bio: '',
    country: '',
    dateOfBirth: '01/01/1900',
    gender: GENDER_MALE,
    name: ''
  };

  // const initialValues: AuthorBodyType = useMemo(() => {
  //   return {
  //     name: data?.name ?? '',
  //     bio: data?.bio ?? '',
  //     avatarPath: data?.avatarPath ?? '',
  //     gender: Number(data?.gender) ?? 0,
  //     dateOfBirth: data?.dateOfBirth ?? '01/01/1970',
  //     country: data?.country ?? ''
  //   };
  // }, [
  //   data?.avatarPath,
  //   data?.bio,
  //   data?.country,
  //   data?.dateOfBirth,
  //   data?.gender,
  //   data?.name
  // ]);

  useEffect(() => {
    if (data?.avatarPath) setAvatarPath(data?.avatarPath);
  }, [data]);

  const onSubmit = async (values: AuthorBodyType) => {
    await handleSubmit({ ...values, avatarPath: avatarPath });
  };

  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Tác giả', href: route.author.getList.path },
        { label: `${!data ? 'Thêm mới' : 'Cập nhật'} tác giả` }
      ]}
    >
      <BaseForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        schema={authorSchema}
        initialValues={data}
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
                  name='name'
                  label='Họ tên tác giả'
                  placeholder='Nhập họ tên tác giả'
                  required
                />
              </Col>
              <Col span={12}>
                <SelectField
                  getLabel={(option) => option.label}
                  getValue={(option) => option.value}
                  options={genderOptions}
                  control={form.control}
                  name='gender'
                  label='Giới tính'
                  placeholder='Giới tính'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DatePickerField
                  control={form.control}
                  name='dateOfBirth'
                  label='Ngày sinh'
                  placeholder='Chọn ngày sinh'
                  required
                  format='dd/MM/yyyy'
                />
              </Col>
              <Col span={12}>
                <SelectField
                  getLabel={(option) => option.label}
                  getValue={(option) => option.value}
                  options={countryOptions}
                  control={form.control}
                  name='country'
                  label='Quốc tịch'
                  placeholder='Quốc tịch'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <RichTextField
                  label='Tiểu sử'
                  placeholder='Nhập tiểu sử'
                  control={form.control}
                  name='bio'
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
