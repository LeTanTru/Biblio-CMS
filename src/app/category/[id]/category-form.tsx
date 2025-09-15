'use client';

import {
  AutoCompleteField,
  Button,
  Col,
  InputField,
  Row,
  TextAreaField,
  UploadImageField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { CircleLoading } from '@/components/loading';
import { categoryErrorMaps, STATUS_ACTIVE, statusOptions } from '@/constants';
import { useNavigate } from '@/hooks';
import { logger } from '@/logger';
import {
  useCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUploadImageMutation
} from '@/queries';
import route from '@/routes';
import { categorySchema } from '@/schemaValidations';
import { CategoryBodyType } from '@/types';
import { applyFormErrors, notify, renderImageUrl } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function CategoryForm() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreate = id === 'create';

  const categoryQuery = useCategoryQuery(id);
  const createCategoryMutation = useCreateCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const uploadImageMutation = useUploadImageMutation();

  const category = categoryQuery.data?.data;

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

  const onSubmit = async (
    values: CategoryBodyType,
    form: UseFormReturn<CategoryBodyType>
  ) => {
    const mutation = isCreate ? createCategoryMutation : updateCategoryMutation;
    await mutation.mutateAsync(
      isCreate ? { ...values, imageUrl } : { ...values, imageUrl, id },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success(
              `${isCreate ? 'Thêm mới' : 'Cập nhật'} danh mục thành công`
            );
            queryClient.invalidateQueries({ queryKey: ['category', id] });
            navigate(route.category.getList.path);
          } else {
            const errCode = res.code;
            if (errCode) {
              applyFormErrors(form, errCode, categoryErrorMaps);
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
    <BaseForm
      defaultValues={defaultValues}
      initialValues={initialValues}
      onSubmit={onSubmit}
      schema={categorySchema}
      className='w-200 rounded-lg bg-white p-4'
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
                className='focus-visible:ring-dodger-blue'
              />
            </Col>
            <Col span={12}>
              <AutoCompleteField
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
              <TextAreaField
                control={form.control}
                name='description'
                label='Mô tả'
                placeholder='Nhập mô tả'
                className='focus-visible:ring-dodger-blue'
                required
              />
            </Col>
          </Row>
          <Row className='my-0 justify-end'>
            <Col span={4}>
              <Button
                type='button'
                variant={'ghost'}
                onClick={() => navigate(route.category.getList.path)}
                className='border border-red-500 text-red-500 hover:border-red-500/50 hover:bg-transparent! hover:text-red-500/50'
              >
                Hủy
              </Button>
            </Col>
            <Col span={4}>
              <Button
                disabled={
                  !form.formState.isDirty ||
                  createCategoryMutation.isPending ||
                  updateCategoryMutation.isPending
                }
                type='submit'
                variant={'primary'}
              >
                {createCategoryMutation.isPending ||
                updateCategoryMutation.isPending ? (
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
  );
}
