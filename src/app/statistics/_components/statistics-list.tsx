'use client';

import NewCustomerCard from '@/app/statistics/_components/new-customer-card';
import RevenueCard from '@/app/statistics/_components/revenue-card';
import TopDiscountProductList from '@/app/statistics/_components/top-discount-product-list';
import TopSellerProductList from '@/app/statistics/_components/top-seller-product-list';
import TopViewProductList from '@/app/statistics/_components/top-view-product-list';
import { Col, Row } from '@/components/form';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { Separator } from '@/components/ui/separator';

export default function StatisticsList() {
  return (
    <PageWrapper breadcrumbs={[{ label: 'Thống kê' }]}>
      <ListPageWrapper>
        <Row className='mb-0 p-4'>
          <Col span={4} gutter={0}>
            <RevenueCard />
          </Col>
          <Col span={4} gutter={0}>
            <NewCustomerCard />
          </Col>
        </Row>
        <Separator className='my-2' />
        <Row className='mb-0 px-4'>
          <Col gutter={0}>
            <TopViewProductList />
          </Col>
        </Row>
        <Separator className='my-2' />
        <Row className='mb-0 px-4'>
          <Col gutter={0}>
            <TopDiscountProductList />
          </Col>
        </Row>
        <Separator className='my-2' />
        <Row className='mb-0 px-4'>
          <Col gutter={0}>
            <TopSellerProductList />
          </Col>
        </Row>
      </ListPageWrapper>
    </PageWrapper>
  );
}
