'use client';

import ConfirmDelivered from '@/app/order/_components/confirm-delivered';
import ConfirmOrderButton from '@/app/order/_components/confirm-order-button';
import ConfirmPackageOrderButton from '@/app/order/_components/confirm-package-order-button';
import ConfirmShippingOrder from '@/app/order/_components/confirm-shipping-order';
import OrderDetailSkeleton from '@/app/order/_components/order-detail-skeleton';
import { Button } from '@/components/form';
import { PageWrapper } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  COUPON_KIND_DISCOUNT,
  COUPON_KIND_FREESHIP,
  DATE_TIME_FORMAT,
  ORDER_DETAIL_STATUS_CANCELLED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_PACKING,
  ORDER_STATUS_SHIPPING,
  ORDER_STATUS_WAITING_CONFIRMATION,
  orderDetailStatuses,
  orderStatuses,
  paymentMethods,
  productVariantConditions,
  productVariantFormats
} from '@/constants';
import { useQueryParams } from '@/hooks';
import { cn } from '@/lib';
import { useOrderQuery } from '@/queries';
import route from '@/routes';
import {
  formatDate,
  formatMoney,
  renderImageUrl,
  renderListPageUrl
} from '@/utils';
import { MapPin, Send } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function OrderDetail() {
  const { queryString } = useQueryParams();
  const { id } = useParams<{ id: string }>();
  const orderQuery = useOrderQuery(id);
  const order = orderQuery.data?.data;
  const orderStatusList = order?.orderStatuses || [];
  const orderItems = order?.orderItems || [];

  if (orderQuery.isLoading) return <OrderDetailSkeleton />;

  if (!order) return null;

  const orderStatus = orderStatuses.find(
    (status) => status.value === order.currentStatus
  );

  const currentIndex = orderDetailStatuses.findIndex(
    (s) => s.value === order.currentStatus
  );

  const getStatusDate = (statusValue: number) => {
    const found = orderStatusList.find((s: any) => s.status === statusValue);
    if (!found) return null;
    return formatDate(found.createdDate.toString(), DATE_TIME_FORMAT);
  };

  const total = order.orderItems
    .reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.price) * item.quantity * (100 - item.discount)) / 100,
      0
    )
    .toFixed(2);

  const freeShip =
    order.coupons.find((coupon) => coupon.kind === COUPON_KIND_FREESHIP)
      ?.value ?? 0;

  const discount =
    order.coupons.find((coupon) => coupon.kind === COUPON_KIND_DISCOUNT)
      ?.value ?? 0;

  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Đơn hàng',
          href: renderListPageUrl(route.order.getList.path, queryString)
        },
        {
          label: 'Chi tiết đơn hàng'
        }
      ]}
    >
      <div className='h-full rounded-lg bg-white px-4 pb-4 shadow-[0px_0px_10px_2px] shadow-gray-200'>
        <div className='flex items-center justify-between py-4'>
          <span>
            <span className='font-semibold'>Mã đơn hàng:</span> {order.id}
          </span>
          <Badge className={cn(orderStatus?.color, 'py-1 text-sm')}>
            {orderStatus?.label}
          </Badge>
        </div>
        <Separator />

        {order.currentStatus === ORDER_DETAIL_STATUS_CANCELLED ? (
          <div className='py-8 pl-4'>
            <span className='text-lg text-orange-600'>Đã hủy đơn hàng</span>
            <br />
            vào: {getStatusDate(order.currentStatus)}
          </div>
        ) : (
          <div className='relative grid grid-cols-7 py-4'>
            {orderDetailStatuses.map((item, index) => {
              const isLast = index === orderDetailStatuses.length - 1;
              const isActive = index <= currentIndex;
              const isLineActive = index < currentIndex;

              const borderDelay = index * 300;
              const lineDelay = borderDelay + 100;

              return (
                <div
                  key={item.label}
                  className='relative flex flex-col items-center text-center select-none'
                >
                  <div
                    style={{
                      transitionDelay: `${borderDelay}ms`
                    }}
                    className={cn(
                      'relative z-1 flex h-14 w-14 items-center justify-center rounded-full border-4 border-solid transition-all duration-500 ease-in-out',
                      {
                        'border-green-500 bg-green-50 text-green-600': isActive,
                        'border-neutral-300 bg-white text-neutral-300':
                          !isActive
                      }
                    )}
                  >
                    {item.icon && <item.icon className='size-7' />}
                  </div>

                  {!isLast && (
                    <div className='absolute top-[28px] left-1/2 -z-0 h-[4px] w-full bg-neutral-300'>
                      <div
                        style={{
                          transitionDelay: `${lineDelay}ms`
                        }}
                        className={cn(
                          'h-full w-full origin-left transform bg-green-500 transition-transform duration-700 ease-in-out',
                          {
                            'scale-x-100': isLineActive,
                            'scale-x-0': !isLineActive
                          }
                        )}
                      />
                    </div>
                  )}

                  <h3 className='mt-4 mb-1 block text-center text-sm font-medium whitespace-nowrap text-slate-800'>
                    {item.label}
                  </h3>
                  <span className='h-[14px] text-xs text-gray-400'>
                    {getStatusDate(item.value)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <Separator />

        <div className='flex items-center py-4'>
          <MapPin className='size-5' />
          <span className='ml-1 font-semibold'>Địa chỉ giao hàng:</span>
          &nbsp;
          {order.address.detail}, {order.address.hamlet}, &nbsp;
          {order.address.ward}, {order.address.district}, &nbsp;
          {order.address.city}
        </div>

        <Separator />

        {order.note && (
          <>
            <div className='py-4'>
              <div className='flex items-center'>
                <Send className='size-5' />
                <span className='ml-1 font-semibold'>Lời nhắn:</span>
                &nbsp;
                {order.note}
              </div>
            </div>
            <Separator />
          </>
        )}
        {orderItems.map((orderItem) => (
          <div key={orderItem.id}>
            <div className='flex items-center py-4'>
              <div className='flex h-20 w-full items-center'>
                <div className='flex-shrink-0'>
                  <Image
                    src={renderImageUrl(orderItem.productVariant.imageUrl)}
                    width={90}
                    height={90}
                    alt={'Sách'}
                    className='rounded-lg object-contain'
                  />
                </div>
                <div className='ml-6 flex h-full w-full items-stretch justify-between'>
                  <div className='flex flex-col justify-between'>
                    <span className='hover:text-dodger-blbg-dodger-blue block flex-1 flex-shrink-0 transition-all duration-200 ease-linear'>
                      {orderItem.productVariant.product.name}
                    </span>
                    <>
                      <p className='font-medium text-gray-400'>
                        Phân loại: &nbsp;
                        {
                          productVariantConditions.find(
                            (pvc) =>
                              pvc.value === orderItem.productVariant.condition
                          )?.label
                        }
                        &nbsp; & &nbsp;
                        {
                          productVariantFormats.find(
                            (pvf) =>
                              pvf.value === orderItem.productVariant.format
                          )?.label
                        }
                      </p>
                      <p className='text-zinc-800'>x{orderItem.quantity}</p>
                    </>
                  </div>
                  <div className='flex flex-col items-end justify-center'>
                    {orderItem.discount === 0 ? (
                      <p className='text-zinc-800'>
                        {formatMoney(orderItem.total)}
                      </p>
                    ) : (
                      <div className='flex items-center gap-x-2'>
                        <p className='text-zinc-800'>
                          {formatMoney(orderItem.total)}
                        </p>
                        <p className='text-xs text-gray-400 line-through'>
                          {formatMoney(orderItem.price)}
                        </p>
                        {orderItem.productVariant.product.discount !== 0 && (
                          <div className='flex items-center gap-2'>
                            <p className='bg-dodger-blue rounded p-0.5 text-xs text-white'>
                              -{orderItem.productVariant.product.discount} %
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Separator />
          </div>
        ))}

        <SummaryRow
          title='Yêu cầu bởi'
          value='Nguời mua'
          hidden={order.currentStatus < ORDER_DETAIL_STATUS_CANCELLED}
        />

        <SummaryRow
          title='Phương thức thanh toán'
          value={
            paymentMethods.find((pmth) => pmth.value === order.paymentMethod)
              ?.label ?? 'Chưa thanh toán'
          }
        />

        <SummaryRow title='Tổng tiền' value={+total} hidden={false} />

        <SummaryRow
          title='Phí vận chuyển'
          value={+order.deliveryFee}
          hidden={+order.deliveryFee === 0}
        />

        <SummaryRow
          title='Giảm phí vận chuyển'
          prefix={
            +freeShip > 0 &&
            +freeShip <= 100 && (
              <span className='bg-dodger-blue mr-1 rounded-sm p-0.5 text-xs text-white'>
                -{freeShip}%
              </span>
            )
          }
          value={
            +freeShip > 0 && +freeShip <= 100
              ? (+freeShip * +total) / 100
              : +freeShip
          }
          hidden={+freeShip === 0}
        />

        <SummaryRow
          title='Giảm giá sách'
          prefix={
            +discount > 0 &&
            +discount <= 100 && (
              <span className='bg-dodger-blue mr-1 rounded-sm p-0.5 text-xs text-white'>
                -{discount}%
              </span>
            )
          }
          value={
            +discount > 0 && +discount <= 100
              ? (+discount * +total) / 100
              : +discount * -1
          }
          hidden={+discount === 0}
        />

        <SummaryRow title='Thành tiền' value={+order.total} />

        {orderStatus?.value === ORDER_STATUS_WAITING_CONFIRMATION && (
          <div className='mt-4 flex justify-end gap-x-2'>
            <Button
              variant={'outline'}
              className='text-destructive border-destructive hover:text-destructive/80 hover:border-destructive/80 transition-all duration-200 ease-linear'
            >
              Từ chối
            </Button>
            <ConfirmOrderButton orderId={order.id} />
          </div>
        )}

        {orderStatus?.value === ORDER_STATUS_CONFIRMED && (
          <div className='mt-4 flex justify-end gap-x-2'>
            <ConfirmPackageOrderButton orderId={order.id} />
          </div>
        )}

        {orderStatus?.value === ORDER_STATUS_PACKING && (
          <div className='mt-4 flex justify-end gap-x-2'>
            <ConfirmShippingOrder orderId={order.id} />
          </div>
        )}

        {orderStatus?.value === ORDER_STATUS_SHIPPING && (
          <div className='mt-4 flex justify-end gap-x-2'>
            <ConfirmDelivered orderId={order.id} />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

function SummaryRow({
  title,
  value,
  hidden = false,
  bottomLine = true,
  prefix,
  suffix
}: {
  title: string;
  value: string | number;
  hidden?: boolean;
  bottomLine?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  if (hidden) return null;
  return (
    <>
      <div className='flex h-12 items-center justify-end text-right'>
        <div className='relative flex h-full items-center'>
          {title}: &nbsp;
          <div className='absolute top-0 right-0 h-full w-px bg-gray-200'></div>
        </div>
        <span className='w-50 font-semibold'>
          {prefix}
          {typeof value === 'string' ? value : formatMoney(value)}
          {suffix}
        </span>
      </div>

      {bottomLine && <Separator />}
    </>
  );
}
