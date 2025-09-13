import { SidebarLayout } from '@/components/layout';

export default function ProfileLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
