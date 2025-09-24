'use client';
import {
  AutoCompleteField,
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
import {
  ageRatings,
  apiConfig,
  CONTRIBUTOR_AUTHOR,
  CONTRIBUTOR_TRANSLATOR,
  languageOptions,
  STATUS_ACTIVE
} from '@/constants';
import { useQueryParams, useSaveBase } from '@/hooks';
import { logger } from '@/logger';
import route from '@/routes';
import { productSchema } from '@/schemaValidations';
import {
  AuthorResType,
  CategoryResType,
  ProductBodyType,
  ProductResType,
  PublisherResType,
  TranslatorResType
} from '@/types';
import { renderListPageUrl } from '@/utils';
import { omit } from 'lodash';
import { useMemo } from 'react';

export default function ProductForm({ queryKey }: { queryKey: string }) {
  const { queryString } = useQueryParams();

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
    contributorIds: [],
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
      contributorIds: data?.contributors?.map((contr) => contr.id) ?? [],
      authorIds: data?.contributors
        ?.filter((contr) => contr.kind === CONTRIBUTOR_AUTHOR)
        .map((auth) => auth.id),
      translatorIds: data?.contributors
        ?.filter((contr) => contr.kind === CONTRIBUTOR_TRANSLATOR)
        .map((trans) => trans.id),
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
      price: data?.price ?? 0,
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
    const authorIds = values.authorIds;
    const translatorIds = values.translatorIds;
    const contributorIds: string[] = [];
    if (authorIds) {
      authorIds.forEach((auth) => {
        contributorIds.push(auth);
      });
    }
    if (translatorIds) {
      translatorIds.forEach((auth) => {
        contributorIds.push(auth);
      });
    }
    const payload = {
      ...omit(values, ['authorIds', 'translatorIds']),
      contributorIds,
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
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                {/* <SelectField
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
                /> */}
                <AutoCompleteField<any, CategoryResType>
                  control={form.control}
                  name='categoryId'
                  label='Danh mục'
                  placeholder='Danh mục'
                  apiConfig={apiConfig.category.autoComplete}
                  searchParams={['name']}
                  mappingData={(item) => ({
                    label: item.name,
                    value: item.id
                  })}
                  initialParams={{ status: STATUS_ACTIVE }}
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
                <AutoCompleteField<any, AuthorResType>
                  control={form.control}
                  name='authorIds'
                  label='Tác giả'
                  placeholder='Tác giả'
                  apiConfig={apiConfig.author.autoComplete}
                  searchParams={['name']}
                  mappingData={(item) => ({
                    label: item.name,
                    value: item.id
                  })}
                  initialParams={{ status: STATUS_ACTIVE }}
                  required
                  multiple
                />
              </Col>
              <Col span={12}>
                <AutoCompleteField<any, TranslatorResType>
                  control={form.control}
                  name='translatorIds'
                  label='Dịch giả'
                  placeholder='Dịch giả'
                  apiConfig={apiConfig.translator.autoComplete}
                  searchParams={['name']}
                  mappingData={(item) => ({
                    label: item.name,
                    value: item.id
                  })}
                  initialParams={{ status: STATUS_ACTIVE }}
                  multiple
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <AutoCompleteField<any, PublisherResType>
                  control={form.control}
                  name='publisherId'
                  label='Nhà xuất bản'
                  placeholder='Nhà xuất bản'
                  apiConfig={apiConfig.publisher.autoComplete}
                  searchParams={['name']}
                  mappingData={(item) => ({
                    label: item.name,
                    value: item.id
                  })}
                  initialParams={{ status: STATUS_ACTIVE }}
                  required
                />
              </Col>
              <Col span={12}>
                <BooleanField
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
