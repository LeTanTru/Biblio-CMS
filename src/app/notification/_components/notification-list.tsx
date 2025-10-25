'use client';
import NoficationItem from '@/app/notification/_components/notification-item';
import NotificationItemSkeleton from '@/app/notification/_components/notification-item-skeleton';
import { Button } from '@/components/form';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import List from '@/components/list';
import { CircleLoading } from '@/components/loading';
import { NoData } from '@/components/no-data';
import Pagination from '@/components/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { apiConfig, queryKeys } from '@/constants';
import { useListBase } from '@/hooks';
import {
  useCountUnreadNotificationQuery,
  useDeleteAllNotificationMutation,
  useReadAllNotificationMutation
} from '@/queries';
import { useAuthStore } from '@/store';
import { NotificationResType, NotificationSearchType } from '@/types';
import { notify } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCheck, Info, Trash } from 'lucide-react';
import { useEffect } from 'react';

export default function NotificationList({ queryKey }: { queryKey: string }) {
  const { socket } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, loading, listQuery, handlers, pagination } = useListBase<
    NotificationResType,
    NotificationSearchType
  >({
    apiConfig: apiConfig.notification,
    options: {
      queryKey,
      objectName: 'thông báo'
    }
  });

  const readAllNotificationMutation = useReadAllNotificationMutation();
  const countUnreadNotificationQuery = useCountUnreadNotificationQuery();
  const deleteAllNotificationMutation = useDeleteAllNotificationMutation();

  const unreadCount = countUnreadNotificationQuery.data?.data?.count || 0;

  useEffect(() => {
    socket?.on('notification', (data) => {
      // listQuery.refetch();
      // countUnreadNotificationQuery.refetch();
      handlers.invalidateQueries();
      queryClient.invalidateQueries({
        queryKey: [`count-unread-${queryKeys.NOTIFICATION}`]
      });
    });
  }, [socket]);

  const handleReadAllNotification = async () => {
    if (unreadCount) {
      await readAllNotificationMutation.mutateAsync();
      // listQuery.refetch();
      // countUnreadNotificationQuery.refetch();
      handlers.invalidateQueries();
      queryClient.invalidateQueries({
        queryKey: [`count-unread-${queryKeys.NOTIFICATION}`]
      });
    }
  };

  const handleDeleteAllNotification = async () => {
    await deleteAllNotificationMutation.mutateAsync(undefined, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Xóa tất cả thông báo thành công');
          handlers.invalidateQueries();
          queryClient.invalidateQueries({
            queryKey: [`count-unread-${queryKeys.NOTIFICATION}`]
          });
        }
      }
    });
  };

  return (
    <PageWrapper breadcrumbs={[{ label: 'Thông báo' }]}>
      <ListPageWrapper>
        {loading ? (
          [...Array(5)].map((_, i) => <NotificationItemSkeleton key={i} />)
        ) : data.length > 0 ? (
          <div className='max-h-[80vh]'>
            <div className='flex items-center justify-between px-4'>
              <span>Thông báo ({unreadCount})</span>
              <div className='flex items-center gap-x-2'>
                <Button
                  variant={'ghost'}
                  onClick={handleReadAllNotification}
                  className='pr-0! transition-all duration-200 ease-linear hover:text-gray-400'
                >
                  Đọc tất cả
                  <CheckCheck />
                </Button>
                <Separator orientation='vertical' className='h-5!' />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <span>
                      <Button
                        variant={'ghost'}
                        className='text-destructive hover:text-destructive/80 px-0! transition-all duration-200 ease-linear'
                      >
                        Xóa tất cả
                        <Trash />
                      </Button>
                    </span>
                  </AlertDialogTrigger>
                  <AlertDialogContent className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0! data-[state=closed]:slide-out-to-top-0! data-[state=open]:slide-in-from-left-0! data-[state=open]:slide-in-from-top-0! top-[30%] max-w-lg p-4'>
                    <AlertDialogHeader>
                      <AlertDialogTitle className='content flex flex-nowrap items-center gap-2 text-sm font-normal'>
                        <Info className='size-8 fill-orange-500 stroke-white' />
                        Bạn có chắc chắn muốn xóa tất cả thông báo không ?
                      </AlertDialogTitle>
                      <AlertDialogDescription></AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <Button
                          variant='outline'
                          className='border-red-500 text-red-500 transition-all duration-200 ease-linear hover:bg-transparent hover:text-red-500/80'
                        >
                          Không
                        </Button>
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAllNotification}
                        className='bg-dodger-blue hover:bg-dodger-blue/80 cursor-pointer transition-all duration-200 ease-linear'
                      >
                        Có
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <Separator />
            <List className='relative flex h-full max-h-[75vh] flex-col overflow-y-auto'>
              {data.map((notification) => (
                <NoficationItem
                  onDeleteClick={() =>
                    handlers.handleDeleteClick(notification.id)
                  }
                  key={notification.id}
                  notification={notification}
                />
              ))}
              <div className='my-2'>
                <Pagination
                  totalPages={pagination.total}
                  currentPage={pagination.current}
                  changePagination={(page) => handlers.changePagination(page)}
                />
              </div>
              <AnimatePresence>
                {loading ||
                  (listQuery.isFetching && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'linear' }}
                      className='absolute inset-0 top-[55px] z-50 flex items-start justify-center bg-white/70 pt-5'
                    >
                      <CircleLoading className='stroke-dodger-blue size-8' />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </List>
          </div>
        ) : (
          <NoData className='min-h-full' content='Không có thông báo nào' />
        )}
      </ListPageWrapper>
    </PageWrapper>
  );
}
