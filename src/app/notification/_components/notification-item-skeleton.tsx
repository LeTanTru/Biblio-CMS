import ListItem from '@/components/list/list-item';

export default function NotificationItemSkeleton() {
  return (
    <ListItem className='flex gap-x-4 p-2'>
      <div className='skeleton h-18 w-15'></div>
      <div className='flex flex-col justify-between'>
        <h3 className='skeleton h-5 w-50'></h3>
        <span className='skeleton h-5 w-20 text-xs text-gray-400'></span>
      </div>
    </ListItem>
  );
}
