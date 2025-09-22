import { SidebarLayout } from '@/components/layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khuyến mãi'
};

export default function CouponLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
