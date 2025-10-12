export default function ReviewSummarySkeleton() {
  return (
    <>
      <div className='flex flex-col items-center justify-center gap-y-2'>
        <p className='skeleton h-4 w-20 text-xl'></p>
        <div className='flex items-center'>
          {[...Array(5)].map((_, index) => (
            <div
              className='skeleton h-4 w-4 rounded! not-last:mr-2'
              key={index}
            ></div>
          ))}
        </div>
        <div className='skeleton h-4 w-20'></div>
      </div>
      <div className='flex-1'>
        {[...Array(5)].map((item, index) => (
          <div
            key={index}
            className='flex items-center justify-between gap-x-2 not-last:mb-1'
          >
            <span className='skeleton h-4 w-10 text-right whitespace-nowrap'></span>
            <div className='skeleton relative h-1.5 w-4/5 overflow-hidden rounded-lg bg-gray-200'></div>
            <span className='skeleton h-2 w-4'></span>
          </div>
        ))}
      </div>
    </>
  );
}
