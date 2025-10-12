export default function ReviewItemSkeleton() {
  return (
    <div className='flex w-full items-start gap-6 border-b py-4 first:border-t last:border-b-0 last:pb-0'>
      <div className='skeleton h-12.5 w-12.5 rounded-full!'></div>
      <div className='flex flex-col gap-1.5'>
        <div className='flex items-center gap-3'>
          <span className='skeleton h-4 w-25'></span>
          <span className='skeleton h-4 w-20'></span>
        </div>
        <p className='skeleton mt-2 h-4 w-100'></p>
      </div>
    </div>
  );
}
