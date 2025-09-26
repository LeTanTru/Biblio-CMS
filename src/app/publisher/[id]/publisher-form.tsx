'use client';

import {
  Col,
  InputField,
  RichTextField,
  Row,
  UploadImageField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { PageWrapper } from '@/components/layout';
import { CircleLoading } from '@/components/loading';
import { apiConfig } from '@/constants';
import { useSaveBase } from '@/hooks';
import { useUploadAvatar } from '@/queries';
import route from '@/routes';
import { publisherSchema } from '@/schemaValidations';
import { PublisherBodyType, PublisherResType } from '@/types';
import { renderImageUrl } from '@/utils';
import { useEffect, useMemo, useState } from 'react';

export default function PublisherForm({ queryKey }: { queryKey: string }) {
  const [logoPath, setLogoPath] = useState<string>('');
  const { data, loading, handleSubmit, renderActions } = useSaveBase<
    PublisherResType,
    PublisherBodyType
  >({
    apiConfig: apiConfig.publisher,
    options: {
      queryKey,
      objectName: 'nhà xuất bản',
      listPageUrl: route.publisher.getList.path
    }
  });
  const uploadImageMutation = useUploadAvatar();
  const defaultValues: PublisherBodyType = {
    logoPath: '',
    name: '',
    description: ''
  };
  const initialValues: PublisherBodyType = useMemo(() => {
    return {
      name: data?.name ?? '',
      logoPath: data?.logoPath ?? '',
      description: data?.description ?? ''
    };
  }, [data?.description, data?.logoPath, data?.name]);
  useEffect(() => {
    if (data?.logoPath) setLogoPath(data?.logoPath);
  }, [data]);
  const onSubmit = async (values: PublisherBodyType) => {
    await handleSubmit({ ...values, logoPath: logoPath });
  };
  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Nhà xuất bản', href: route.publisher.getList.path },
        { label: `${!data ? 'Thêm mới' : 'Cập nhật'} nhà xuất bản` }
      ]}
    >
      <BaseForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        schema={publisherSchema}
        initialValues={initialValues}
      >
        {(form) => (
          <>
            <Row>
              <Col>
                <UploadImageField
                  value={renderImageUrl(logoPath)}
                  loading={uploadImageMutation.isPending}
                  control={form.control}
                  name='logoPath'
                  onChange={(url) => {
                    setLogoPath(url);
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
                  label='Tên nhà xuất bản'
                  placeholder='Nhập tên nhà xuất bản'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <RichTextField
                  label='Mô tả'
                  placeholder='Nhập mô tả'
                  control={form.control}
                  name='description'
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
