'use client';
import {
  Col,
  DateTimePickerField,
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
  apiConfig,
  COUPON_KIND_DISCOUNT,
  COUPON_TYPE_FIXED,
  couponErrorMaps,
  couponKinds,
  couponTypes
} from '@/constants';
import { useQueryParams, useSaveBase } from '@/hooks';
import route from '@/routes';
import { couponSchema } from '@/schemaValidations';
import { CouponBodyType, CouponResType } from '@/types/coupon.type';
import { renderListPageUrl } from '@/utils';
import { addDays } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';

export default function CouponForm({ queryKey }: { queryKey: string }) {
  const { queryString } = useQueryParams();
  const {
    data: coupon,
    loading,
    handleSubmit,
    renderActions
  } = useSaveBase<CouponResType, CouponBodyType>({
    apiConfig: apiConfig.coupon,
    options: {
      queryKey,
      objectName: 'khuyến mãi',
      listPageUrl: route.coupon.getList.path
    }
  });

  const defaultValues: CouponBodyType = {
    code: '',
    description: '',
    kind: COUPON_KIND_DISCOUNT,
    minOrderAmount: 0,
    name: '',
    quantity: 0,
    type: COUPON_TYPE_FIXED,
    validFrom: new Date(),
    validTo: addDays(new Date(), 7),
    value: 0
  };

  const onSubmit = async (
    values: CouponBodyType,
    form: UseFormReturn<CouponBodyType>
  ) => {
    await handleSubmit({ ...values }, form, couponErrorMaps);
  };

  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Danh mục',
          href: renderListPageUrl(route.coupon.getList.path, queryString)
        },
        { label: `${!coupon ? 'Thêm mới' : 'Cập nhật'} khuyến mãi` }
      ]}
    >
      <BaseForm
        initialValues={coupon}
        defaultValues={defaultValues}
        schema={couponSchema}
        onSubmit={onSubmit}
      >
        {(form) => (
          <>
            <Row>
              <Col span={12}>
                <InputField
                  control={form.control}
                  name='name'
                  label='Tên khuyến mãi'
                  placeholder='Tên khuyến mãi'
                  required
                />
              </Col>
              <Col span={12}>
                <InputField
                  control={form.control}
                  name='code'
                  label='Mã khuyến mãi'
                  placeholder='Mã khuyến mãi'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <SelectField
                  control={form.control}
                  getLabel={(opt) => opt.label}
                  getValue={(opt) => opt.value}
                  label='Kiểu khuyến mãi'
                  name='kind'
                  options={couponKinds}
                  placeholder='Kiểu khuyến mãi'
                  required
                />
              </Col>
              <Col span={12}>
                <SelectField
                  control={form.control}
                  getLabel={(opt) => opt.label}
                  getValue={(opt) => opt.value}
                  label='Loại khuyến mãi'
                  name='type'
                  options={couponTypes}
                  placeholder='Loại khuyến mãi'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <NumberField
                  control={form.control}
                  name='minOrderAmount'
                  label='Giá trị tối thiểu'
                  placeholder='Giá trị tối thiểu'
                  required
                />
              </Col>
              <Col span={12}>
                <NumberField
                  control={form.control}
                  name='value'
                  label='Giá trị'
                  placeholder='Giá trị'
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DateTimePickerField
                  control={form.control}
                  name='validFrom'
                  label='Từ'
                  required
                />
              </Col>
              <Col span={12}>
                <DateTimePickerField
                  control={form.control}
                  name='validTo'
                  label='Đến'
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
            </Row>
            <Row>
              <Col>
                <RichTextField
                  control={form.control}
                  name='description'
                  label='Mô tả'
                  placeholder='Mô tả'
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
