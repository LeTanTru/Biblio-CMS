import { cn } from '@/lib';

export default function ListPageWrapper({
  className,
  children,
  searchForm,
  addButton,
  reloadButton
}: {
  className?: string;
  children?: React.ReactNode;
  searchForm?: React.ReactNode;
  addButton?: React.ReactNode;
  reloadButton?: React.ReactNode;
}) {
  return (
    <div
      tabIndex={-1}
      className={cn(
        'min-h-[calc(100vh_-_190px)] rounded-lg bg-white',
        className
      )}
    >
      <div
        className={cn(
          'flex items-start justify-between rounded-tl-lg rounded-tr-lg bg-white p-4',
          {
            'py-0': !(searchForm || addButton || reloadButton)
          }
        )}
      >
        {searchForm && <div className='flex-1'>{searchForm}</div>}
        <div
          className={cn('flex gap-2', {
            'ml-auto': !searchForm
          })}
        >
          {reloadButton}
          {addButton}
        </div>
      </div>
      {children}
    </div>
  );
}
