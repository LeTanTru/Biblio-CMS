import { PropsWithChildren, HTMLAttributes } from 'react';
import { cn } from '@/lib';
import { DEFAULT_COL_SPAN } from '@/constants';

type ColProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  span?: number;
  gutter?: number;
};

export default function Col({
  children,
  className,
  span = DEFAULT_COL_SPAN,
  gutter = 8,
  ...rest
}: ColProps) {
  const width = gutter
    ? `calc(${(span * 100) / 24}% - ${gutter}px)`
    : `${(span * 100) / 24}%`;

  return (
    <div style={{ width }} className={cn('flex flex-col', className)} {...rest}>
      {children}
    </div>
  );
}
