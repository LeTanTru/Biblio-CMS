import Footer from '@/components/footer';
import { Breadcrumb } from '@/components/form';
import { cn } from '@/lib';
import { BreadcrumbType } from '@/types';

export default function PageWrapper({
  children,
  breadcrumbs,
  loading,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  breadcrumbs: BreadcrumbType[];
  loading?: boolean;
}) {
  return (
    <main
      className={cn('bg-page-wrapper h-[calc(100vh_-_64px)]', {
        'overflow-y-auto': !loading
      })}
      {...props}
    >
      <div className='min-h-[calc(100vh_-_128px)]'>
        <div className='page-header px-5 py-4'>
          <Breadcrumb items={breadcrumbs} />
        </div>
        <div className='page-content px-2 pb-2'>{children}</div>
      </div>
      <Footer />
    </main>
  );
}
