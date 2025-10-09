'use client';
import {
  Col,
  NumberField,
  Row,
  SelectField,
  UploadImageField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { PageWrapper } from '@/components/layout';
import {
  apiConfig,
  ErrorCode,
  PRODUCT_VARIANT_CONDITION_NEW,
  PRODUCT_VARIANT_FORMAT_HARD_COVER,
  productVariantConditions,
  productVariantFormats
} from '@/constants';
import { useQueryParams, useSaveBase } from '@/hooks';
import { useUploadImageProduct } from '@/queries';
import route from '@/routes';
import { productVariantSchema } from '@/schemaValidations';
import { ProductVariantBodyType, ProductVariantResType } from '@/types';
import {
  generatePath,
  notify,
  renderImageUrl,
  renderListPageUrl
} from '@/utils';
import { AxiosError, isAxiosError } from 'axios';
import { omit } from 'lodash';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function ProductVariantForm({ queryKey }: { queryKey: string }) {
  const { queryString } = useQueryParams();
  const uploadImageMutation = useUploadImageProduct();
  const [imageUrl, setImageUrl] = useState<string>('');
  const { variantId, id: productId } = useParams<{
    variantId: string;
    id: string;
  }>();
  const { data, setDetailId, renderActions, handleSubmit } = useSaveBase<
    ProductVariantResType,
    ProductVariantBodyType
  >({
    apiConfig: apiConfig.productVariant,
    options: {
      queryKey,
      objectName: 'phân loại sách',
      listPageUrl: generatePath(route.productVariant.getList.path, {
        id: productId
      })
    }
  });

  useEffect(() => {
    if (variantId) setDetailId(variantId);
  }, [variantId]);

  const defaultValues: ProductVariantBodyType = {
    condition: PRODUCT_VARIANT_CONDITION_NEW,
    format: PRODUCT_VARIANT_FORMAT_HARD_COVER,
    imageUrl: '',
    modifiedPrice: 0,
    productId: productId,
    quantity: 1
  };

  const initialValues: ProductVariantBodyType = useMemo(
    () => ({
      condition: data?.condition ?? PRODUCT_VARIANT_CONDITION_NEW,
      format: data?.format ?? PRODUCT_VARIANT_FORMAT_HARD_COVER,
      imageUrl: data?.imageUrl ?? '',
      modifiedPrice: data?.modifiedPrice ?? 0,
      productId: productId,
      quantity: data?.quantity ?? 1
    }),
    [
      data?.condition,
      data?.format,
      data?.imageUrl,
      data?.modifiedPrice,
      data?.quantity,
      productId
    ]
  );

  useEffect(() => {
    if (data?.imageUrl) setImageUrl(data?.imageUrl);
  }, [data]);

  const onSubmit = async (values: ProductVariantBodyType) => {
    try {
      await handleSubmit(
        !data ? { ...values } : { ...omit(values, ['productId']), id: data.id }
      );
    } catch (error) {
      if (isAxiosError(error)) {
        const errCode = error.response?.data?.code;
        if (errCode === ErrorCode.PRODUCT_VARIANT_ERROR_EXISTED) {
          notify.error('Tình trạng và định dạng phân loại sách đã tồn tại');
        }
      }
    }
  };

  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Sách',
          href: generatePath(route.product.getList.path, { id: productId })
        },
        {
          label: 'Phân loại sách',
          href: renderListPageUrl(
            generatePath(route.productVariant.getList.path, {
              id: productId
            }),
            queryString
          )
        },
        { label: `${!data ? 'Thêm mới' : 'Cập nhật'} phân loại sách` }
      ]}
    >
      <BaseForm
        schema={productVariantSchema}
        defaultValues={defaultValues}
        initialValues={initialValues}
        onSubmit={onSubmit}
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
                  required
                  label='Tải lên ảnh sách'
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <SelectField
                  control={form.control}
                  getLabel={(option) => option.label}
                  getValue={(option) => option.value}
                  label='Tình trạng'
                  name='condition'
                  options={productVariantConditions}
                  placeholder='Tình trạng'
                  required
                />
              </Col>
              <Col span={12}>
                <SelectField
                  control={form.control}
                  getLabel={(option) => option.label}
                  getValue={(option) => option.value}
                  label='Định dạng'
                  name='format'
                  options={productVariantFormats}
                  placeholder='Định dạng'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <NumberField
                  control={form.control}
                  name='quantity'
                  label='Số lượng'
                  placeholder='Số lượng'
                  required
                />
              </Col>
              <Col span={12}>
                <NumberField
                  control={form.control}
                  name='modifiedPrice'
                  label='Giá điều chỉnh'
                  placeholder='Giá điều chỉnh'
                />
              </Col>
            </Row>
            <>{renderActions(form)}</>
          </>
        )}
      </BaseForm>
    </PageWrapper>
  );
}
