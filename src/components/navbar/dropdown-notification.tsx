'use client';

import { Button } from '@/components/form';
import List from '@/components/list';
import ListItem from '@/components/list/list-item';
import { NoData } from '@/components/no-data';
import { Separator } from '@/components/ui/separator';
import {
  DATE_TIME_FORMAT,
  NOTIFICATION_TYPE_ORDER,
  queryKeys
} from '@/constants';
import { cn } from '@/lib';
import { logger } from '@/logger';
import {
  useCountUnreadNotificationQuery,
  useMarkReadNotificationMutation,
  useNotificationListQuery,
  useReadAllNotificationMutation
} from '@/queries';
import route from '@/routes';
import { useAuthStore } from '@/store';
import { AccountResType, NotificationResType } from '@/types';
import { formatDate, generatePath, notify, renderImageUrl } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DropDownNotification() {
  const { socket } = useAuthStore();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const notificationListQuery = useNotificationListQuery({ enabled: open });
  const countUnreadNotificationQuery = useCountUnreadNotificationQuery();
  const readAllNotificationMutation = useReadAllNotificationMutation();

  const notificationList = notificationListQuery.data?.data?.content || [];
  const unreadCount = countUnreadNotificationQuery.data?.data?.count || 0;

  const loading = notificationListQuery.isLoading;

  useEffect(() => {
    socket?.on('notification', (data: NotificationResType) => {
      logger.info('🚀 ~ DropDownNotification ~ data:', data);
      notify.info(data.title || 'Bạn có thông báo mới !');
      notificationListQuery.refetch();
      countUnreadNotificationQuery.refetch();
      queryClient.invalidateQueries({
        queryKey: [`${queryKeys.NOTIFICATION}-list`]
      });
      queryClient.invalidateQueries({
        queryKey: [`count-unread-${queryKeys.NOTIFICATION}`]
      });
    });
  }, [socket]);

  const handleReadAllNotification = async () => {
    if (unreadCount) {
      await readAllNotificationMutation.mutateAsync();
      notificationListQuery.refetch();
      countUnreadNotificationQuery.refetch();
      queryClient.invalidateQueries({
        queryKey: [`${queryKeys.NOTIFICATION}-list`]
      });
      queryClient.invalidateQueries({
        queryKey: [`count-unread-${queryKeys.NOTIFICATION}`]
      });
    }
  };

  return (
    <div
      className='relative z-20 flex items-center gap-4'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className='flex cursor-pointer items-center gap-2'>
        <Bell className='size-7' />
        <div
          className={cn(
            'absolute -top-0 right-0 flex h-4 w-4 items-center justify-center rounded-lg bg-white text-xs shadow-[0px_0px_10px_1px] shadow-gray-400'
          )}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.5, transformOrigin: '89% -20px' }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2, ease: 'linear' }}
            className='absolute top-full -right-10 mt-4 w-120 rounded-md bg-white shadow-[0px_0px_10px_8px] shadow-gray-200'
          >
            <div className='z-2 before:absolute before:-top-10 before:left-0 before:h-10 before:w-full before:bg-transparent'></div>
            <div className='absolute -top-3.5 right-9.5 border-r-15 border-b-15 border-l-15 border-r-transparent border-b-white border-l-transparent'></div>
            {loading ? (
              <>
                <div className='flex items-center justify-between px-4'>
                  <span>Thông báo</span>
                  <Button
                    variant={'ghost'}
                    className='pr-0! transition-all duration-200 ease-linear hover:text-gray-400'
                  >
                    Đọc tất cả
                    <CheckCheck />
                  </Button>
                </div>
                <Separator />
                {[...Array(5)].map((_, i) => (
                  <NotificationItemSkeleton key={i} />
                ))}
                <Separator />
                <Button
                  variant={'ghost'}
                  className='skeleton mx-auto block w-full rounded-none! bg-gray-100'
                ></Button>
              </>
            ) : notificationList.length > 0 ? (
              <div className='max-h-[80vh]'>
                <div className='flex items-center justify-between px-4'>
                  <span>Thông báo</span>
                  <Button
                    variant={'ghost'}
                    onClick={handleReadAllNotification}
                    className='pr-0! transition-all duration-200 ease-linear hover:text-gray-400'
                  >
                    Đọc tất cả
                    <CheckCheck />
                  </Button>
                </div>
                <Separator />
                <List className='flex h-full max-h-[75vh] min-h-[40vh] flex-col overflow-y-auto rounded-md'>
                  {notificationList.slice(0, 4).map((notification) => (
                    <NoficationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </List>
                <Separator />
                <Link href={route.notification.getList.path}>
                  <Button
                    variant='ghost'
                    className='mx-auto block w-full rounded-none hover:bg-zinc-50'
                  >
                    Xem tất cả
                  </Button>
                </Link>
              </div>
            ) : (
              <NoData
                className='min-h-[50vh]'
                content='Không có thông báo nào'
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NoficationItem({
  notification
}: {
  notification: NotificationResType;
}) {
  const queryClient = useQueryClient();
  const markReadNotificationMutation = useMarkReadNotificationMutation();

  const handleMarkReadNotification = async (id: string) => {
    await markReadNotificationMutation.mutateAsync(id);
    // queryClient.refetchQueries({
    //   queryKey: [`count-unread-${queryKeys.NOTIFICATION}`]
    // });
    // queryClient.invalidateQueries({
    //   queryKey: [`count-unread-${queryKeys.NOTIFICATION}`]
    // });

    queryClient.refetchQueries({
      queryKey: [`${queryKeys.NOTIFICATION}-list`]
    });
    queryClient.invalidateQueries({
      queryKey: [`${queryKeys.NOTIFICATION}-list`]
    });
  };
  const link =
    notification.type === NOTIFICATION_TYPE_ORDER
      ? route.order.savePage.path
      : route.product.savePage.path;
  const data = JSON.parse(notification.data) as {
    orderId: string;
  } & { customer: AccountResType };

  return (
    <ListItem
      className={cn('not-last:border-b', {
        'cursor-pointer bg-gray-100 transition-all duration-200 ease-linear hover:bg-zinc-200':
          !notification.seen
      })}
    >
      <Link
        onClick={() => handleMarkReadNotification(notification.id)}
        className='flex gap-x-4 p-4'
        href={generatePath(link, { id: data.orderId })}
      >
        <div className='h-18 w-12 shrink-0'>
          <Image
            src={renderImageUrl(notification.imageUrl)}
            width={52}
            height={72}
            alt={notification.title}
            unoptimized
            className={cn('h-full w-full bg-red-500 object-cover', {
              'cursor-pointer bg-gray-50 transition-all duration-200 ease-linear hover:bg-gray-100':
                !notification.seen
            })}
          />
        </div>
        <div className='flex flex-col justify-between'>
          <h3>{notification.title}</h3>
          <span className='text-xs text-gray-400'>
            {formatDate(notification.createdDate, DATE_TIME_FORMAT)}
          </span>
        </div>
      </Link>
    </ListItem>
  );
}

function NotificationItemSkeleton() {
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
