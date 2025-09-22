'use client';

import {
  Col,
  InputField,
  RichTextField,
  Row,
  SelectField,
  UploadImageField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { PageWrapper } from '@/components/layout';
import { CircleLoading } from '@/components/loading';
import { apiConfig, STATUS_ACTIVE, statusOptions } from '@/constants';
import { useQueryParams, useSaveBase } from '@/hooks';
import { useUploadImageProduct } from '@/queries';
import route from '@/routes';
import { categorySchema } from '@/schemaValidations';
import { CategoryBodyType, CategoryResType } from '@/types';
import { renderImageUrl, renderListPageUrl } from '@/utils';
import { useEffect, useMemo, useState } from 'react';

export default function CategoryForm({ queryKey }: { queryKey: string }) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const { queryString } = useQueryParams();
  const {
    data: category,
    loading,
    handleSubmit,
    renderActions
  } = useSaveBase<CategoryResType, CategoryBodyType>({
    apiConfig: apiConfig.category,
    options: {
      queryKey,
      objectName: 'danh mục',
      listPageUrl: route.category.getList.path
    }
  });
  const uploadImageMutation = useUploadImageProduct();

  const defaultValues: CategoryBodyType = {
    name: '',
    description: '',
    imageUrl: '',
    status: 1
  };

  const initialValues: CategoryBodyType = useMemo(() => {
    return {
      name: category?.name ?? '',
      description: category?.description ?? '',
      imageUrl: category?.imageUrl ?? '',
      status: category?.status ?? STATUS_ACTIVE
    };
  }, [
    category?.description,
    category?.imageUrl,
    category?.name,
    category?.status
  ]);

  useEffect(() => {
    if (category?.imageUrl) setImageUrl(category?.imageUrl);
  }, [category]);

  const onSubmit = async (values: CategoryBodyType) => {
    await handleSubmit({ ...values, imageUrl: imageUrl });
  };

  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Danh mục',
          href: renderListPageUrl(route.category.getList.path, queryString)
        },
        { label: `${!category ? 'Thêm mới' : 'Cập nhật'} danh mục` }
      ]}
    >
      <BaseForm
        defaultValues={defaultValues}
        initialValues={initialValues}
        onSubmit={onSubmit}
        schema={categorySchema}
      >
        {(form) => (
          <>
            <Row>
              <Col>
                <UploadImageField
                  value={renderImageUrl(imageUrl)}
                  loading={uploadImageMutation.isPending}
                  control={form.control}
                  name='imageUrl'
                  onChange={(url) => {
                    setImageUrl(url);
                  }}
                  size={100}
                  uploadImageFn={async (file: Blob) => {
                    const res = await uploadImageMutation.mutateAsync({ file });
                    return res.data?.filePath ?? '';
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <InputField
                  control={form.control}
                  name='name'
                  label='Tên danh mục'
                  placeholder='Nhập tên danh mục'
                  required
                />
              </Col>
              <Col span={12}>
                <SelectField
                  getLabel={(option) => option.label}
                  getValue={(option) => option.value}
                  options={statusOptions}
                  control={form.control}
                  name='status'
                  label='Trạng thái'
                  placeholder='Trạng thái'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <RichTextField
                  control={form.control}
                  name='description'
                  label='Mô tả'
                  placeholder='Nhập mô tả'
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
