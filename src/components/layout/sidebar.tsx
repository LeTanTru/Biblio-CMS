'use client';

import Navbar from '@/components/navbar';
import { PermissionGuard } from '@/components/permission-guard';
import { AppSidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useSidebarStore } from '@/store';

export default function SidebarLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { state } = useSidebarStore();
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '20rem',
          '--sidebar-width-icon': '5rem'
        } as React.CSSProperties
      }
      defaultOpen={state === 'expanded'}
    >
      <AppSidebar />
      <div className='w-full overflow-y-hidden bg-gray-100'>
        <Navbar />
        <PermissionGuard>{children}</PermissionGuard>
      </div>
    </SidebarProvider>
  );
}
