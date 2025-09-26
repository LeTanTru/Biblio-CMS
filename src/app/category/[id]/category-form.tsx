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
import {
  apiConfig,
  categoryErrorMaps,
  STATUS_ACTIVE,
  statusOptions
} from '@/constants';
import { useQueryParams, useSaveBase } from '@/hooks';
import { useUploadImageProduct } from '@/queries';
import route from '@/routes';
import { categorySchema } from '@/schemaValidations';
import { CategoryBodyType, CategoryResType } from '@/types';
import { renderImageUrl, renderListPageUrl } from '@/utils';
import { omit } from 'lodash';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

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
    status: STATUS_ACTIVE
  };

  // const initialValues: CategoryBodyType = useMemo(() => {
  //   return {
  //     name: category?.name ?? '',
  //     description: category?.description ?? '',
  //     imageUrl: category?.imageUrl ?? '',
  //     status: category?.status ?? STATUS_ACTIVE
  //   };
  // }, [
  //   category?.description,
  //   category?.imageUrl,
  //   category?.name,
  //   category?.status
  // ]);

  useEffect(() => {
    if (category?.imageUrl) setImageUrl(category?.imageUrl);
  }, [category]);

  const onSubmit = async (
    values: CategoryBodyType,
    form: UseFormReturn<CategoryBodyType>
  ) => {
    await handleSubmit(
      { ...omit(values, ['ordering']), imageUrl: imageUrl },
      form,
      categoryErrorMaps
    );
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
        initialValues={category}
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
                  label='Tải lên ảnh danh mục'
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
              <Col span={24}>
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
