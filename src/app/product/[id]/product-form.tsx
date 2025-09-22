'use client';
import {
  BooleanField,
  Col,
  DatePickerField,
  InputField,
  NumberField,
  RichTextField,
  Row,
  SelectField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { PageWrapper } from '@/components/layout';
import { CircleLoading } from '@/components/loading';
import { ageRatings, apiConfig, languageOptions, queryKeys } from '@/constants';
import { useQueryParams, useSaveBase } from '@/hooks';
import { logger } from '@/logger';
import route from '@/routes';
import { productSchema } from '@/schemaValidations';
import {
  ApiResponseList,
  AuthorResType,
  CategoryAutoResType,
  ProductBodyType,
  ProductResType,
  PublisherResType,
  TranslatorResType
} from '@/types';
import { http, renderListPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export default function ProductForm({ queryKey }: { queryKey: string }) {
  const { queryString } = useQueryParams();
  const categoryRes = useQuery({
    queryKey: [`${queryKeys.CATEGORY}-auto-complete`],
    queryFn: () =>
      http.get<ApiResponseList<CategoryAutoResType>>(
        apiConfig.category.autoComplete
      )
  });
  const authorRes = useQuery({
    queryKey: [`${queryKeys.AUTHOR}-auto-complete`],
    queryFn: () =>
      http.get<ApiResponseList<AuthorResType>>(apiConfig.author.autoComplete)
  });
  const translatorRes = useQuery({
    queryKey: [`${queryKeys.TRANSLATOR}-auto-complete`],
    queryFn: () =>
      http.get<ApiResponseList<TranslatorResType>>(
        apiConfig.translator.autoComplete
      )
  });

  const publisherRes = useQuery({
    queryKey: [`${queryKeys.PUBLISHER}-auto-complete`],
    queryFn: () =>
      http.get<ApiResponseList<PublisherResType>>(
        apiConfig.publisher.autoComplete
      )
  });

  const authors =
    authorRes.data?.data.content.map((auth) => ({
      label: auth.name,
      value: auth.id
    })) ?? [];

  const translators =
    translatorRes.data?.data.content.map((trans) => ({
      label: trans.name,
      value: trans.id
    })) ?? [];

  const publishers =
    publisherRes.data?.data.content.map((pub) => ({
      label: pub.name,
      value: pub.id
    })) ?? [];

  const { data, loading, renderActions, handleSubmit } = useSaveBase<
    ProductResType,
    ProductBodyType
  >({
    apiConfig: apiConfig.product,
    options: {
      queryKey,
      objectName: 'sách',
      listPageUrl: route.product.getList.path
    }
  });

  const parseMetadataToObject = (metaData: string) => {
    if (!metaData)
      return { height: 0, length: 0, weight: 0, width: 0, numPage: 0 };
    try {
      const json = JSON.parse(metaData) as ProductBodyType['metaData'];
      return json;
    } catch (error) {
      logger.error('Error whiling parsing metaData json: ', error);
    }
  };

  const defaultValues: ProductBodyType = {
    name: '',
    ageRating: 0,
    categoryId: '',
    contributorsIds: [],
    description: '',
    discount: 0,
    isFeatured: false,
    language: '',
    metaData: { height: 0, length: 0, weight: 0, width: 0, numPage: 0 },
    price: 0,
    releaseDate: '',
    publisherId: ''
  };

  const initialValues: ProductBodyType = useMemo(
    () => ({
      name: data?.name ?? '',
      ageRating: data?.ageRating ?? 0,
      categoryId: data?.category?.id ?? '',
      contributorsIds: data?.contributors?.map((contr) => contr.id) ?? [],
      description: data?.description ?? '',
      discount: data?.discount ?? 0,
      isFeatured: data?.isFeatured ?? false,
      language: data?.language ?? '',
      metaData: parseMetadataToObject(data?.metaData ?? '') ?? {
        height: 0,
        length: 0,
        weight: 0,
        width: 0,
        numPage: 0
      },
      price: Number(data?.price) ?? 0,
      releaseDate: data?.releaseDate ?? new Date().toLocaleDateString(),
      publisherId: data?.publisher.id ?? ''
    }),
    [
      data?.ageRating,
      data?.category?.id,
      data?.contributors,
      data?.description,
      data?.discount,
      data?.isFeatured,
      data?.language,
      data?.metaData,
      data?.name,
      data?.price,
      data?.publisher.id,
      data?.releaseDate
    ]
  );

  const onSubmit = async (values: ProductBodyType) => {
    const payload = {
      ...values,
      metaData: JSON.stringify(values.metaData)
    };

    await handleSubmit(payload as any);
  };

  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Sách',
          href: renderListPageUrl(route.product.getList.path, queryString)
        },
        { label: `${!data ? 'Thêm mới' : 'Cập nhật'} sách` }
      ]}
    >
      <BaseForm
        defaultValues={defaultValues}
        initialValues={initialValues}
        onSubmit={onSubmit}
        schema={productSchema}
      >
        {(form) => (
          <>
            <Row>
              <Col span={12}>
                <InputField
                  control={form.control}
                  name='name'
                  label='Tên sách'
                  placeholder='Nhập tên sách'
                  required
                />
              </Col>
              <Col span={12}>
                <NumberField
                  control={form.control}
                  name='price'
                  label='Giá (VNĐ)'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DatePickerField
                  control={form.control}
                  name='releaseDate'
                  label='Ngày phát hành'
                  placeholder='Ngày phát hành'
                  required
                />
              </Col>
              <Col span={12}>
                <SelectField
                  control={form.control}
                  name='ageRating'
                  label='Độ tuổi'
                  placeholder='Độ tuổi'
                  getLabel={(opt) => opt.label}
                  getValue={(opt) => opt.value}
                  options={ageRatings}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <SelectField
                  control={form.control}
                  name='language'
                  label='Ngôn ngữ'
                  placeholder='Ngôn ngữ'
                  required
                  getLabel={(opt) => opt.label}
                  getValue={(opt) => opt.value}
                  options={languageOptions}
                />
              </Col>
              <Col span={12}>
                <NumberField
                  control={form.control}
                  name='discount'
                  label='Giảm giá (%)'
                  placeholder='Giảm giá (%)'
                  isFloat
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <SelectField
                  control={form.control}
                  name='categoryId'
                  label='Danh mục'
                  placeholder='Danh mục'
                  required
                  getLabel={(opt) => opt.label}
                  getValue={(opt) => opt.value}
                  options={(categoryRes.data?.data.content || []).map(
                    (category) => ({ label: category.name, value: category.id })
                  )}
                />
              </Col>
              <Col span={12}>
                <NumberField
                  control={form.control}
                  name='metaData.length'
                  label='Chiều dài'
                  placeholder='Chiều dài'
                  isFloat
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <NumberField
                  control={form.control}
                  name='metaData.width'
                  label='Chiều rộng'
                  placeholder='Chiều rộng'
                  isFloat
                  required
                />
              </Col>
              <Col span={12}>
                <NumberField
                  control={form.control}
                  name='metaData.height'
                  label='Chiều cao'
                  placeholder='Chiều cao'
                  isFloat
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <NumberField
                  control={form.control}
                  name='metaData.weight'
                  label='Cân nặng (g)'
                  placeholder='Cân nặng (g)'
                  required
                />
              </Col>
              <Col span={12}>
                <NumberField
                  control={form.control}
                  name='metaData.numPage'
                  label='Số trang'
                  placeholder='Số trang'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <SelectField
                  control={form.control}
                  name='publisherId'
                  label='Nhà xuất bản'
                  placeholder='Nhà xuất bản'
                  required
                  getLabel={(opt) => opt.label}
                  getValue={(opt) => opt.value}
                  options={publishers}
                />
              </Col>
              <Col span={12}>
                <SelectField
                  control={form.control}
                  name='contributorsIds'
                  label='Nhà đóng góp'
                  placeholder='Nhà đóng góp'
                  required
                  getLabel={(opt) => opt.label}
                  getValue={(opt) => opt.value}
                  options={[...authors, ...translators]}
                  multiple
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <BooleanField
                  className='my-auto'
                  control={form.control}
                  name='isFeatured'
                  label='Nổi bật'
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
