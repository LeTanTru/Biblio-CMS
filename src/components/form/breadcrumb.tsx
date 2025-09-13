import Link from 'next/link';
import {
  Breadcrumb as OriginBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Fragment } from 'react';
import { ReusableBreadcrumbProps } from '@/types';

export default function Breadcrumb({
  items,
  separator = <BreadcrumbSeparator />
}: ReusableBreadcrumbProps) {
  return (
    <OriginBreadcrumb>
      <BreadcrumbList className='gap-1.5!'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link className='text-breadcrumb' href={item.href}>
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && separator}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </OriginBreadcrumb>
  );
}
