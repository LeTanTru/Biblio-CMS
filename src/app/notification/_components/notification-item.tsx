'use client';

import { Button, ToolTip } from '@/components/form';
import ListItem from '@/components/list/list-item';
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
import {
  DATE_TIME_FORMAT,
  NOTIFICATION_TYPE_ORDER,
  queryKeys
} from '@/constants';
import { cn } from '@/lib';
import { useMarkReadNotificationMutation } from '@/queries';
import route from '@/routes';
import { NotificationResType } from '@/types';
import { generatePath, renderImageUrl } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { formatDate } from 'date-fns';
import { Info, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function NotificationItem({
  notification,
  onDeleteClick
}: {
  notification: NotificationResType;
  onDeleteClick: () => void;
}) {
  const queryClient = useQueryClient();
  const markReadNotificationMutation = useMarkReadNotificationMutation();

  const handleMarkReadNotification = async (id: string) => {
    await markReadNotificationMutation.mutateAsync(id);
    // queryClient.refetchQueries({
    //   queryKey: [`count-unread-${queryKeys.NOTIFICATION}`]
    // });
    queryClient.invalidateQueries({
      queryKey: [`count-unread-${queryKeys.NOTIFICATION}`]
    });

    // queryClient.refetchQueries({
    //   queryKey: [`${queryKeys.NOTIFICATION}-list`]
    // });
    queryClient.invalidateQueries({
      queryKey: [`${queryKeys.NOTIFICATION}-list`]
    });
  };
  const link =
    notification.type === NOTIFICATION_TYPE_ORDER
      ? route.order.savePage.path
      : route.product.savePage.path;
  const data = JSON.parse(notification.data) as { orderId: string };

  return (
    <ListItem
      className={cn(
        'flex items-center justify-between pr-8 not-last:border-b',
        {
          'cursor-pointer bg-zinc-50 transition-all duration-200 ease-linear hover:bg-zinc-100':
            !notification.seen
        }
      )}
    >
      <Link
        onClick={() => handleMarkReadNotification(notification.id)}
        className='flex flex-1 gap-x-4 p-4'
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
          <h3>{notification.content}</h3>
          <span className='text-xs text-gray-400'>
            {formatDate(notification.createdDate, DATE_TIME_FORMAT)}
          </span>
        </div>
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <span>
            <ToolTip title={`Xóa thông báo`}>
              <Button className='border-none bg-transparent shadow-none hover:bg-transparent'>
                <Trash className='size-3.5 stroke-red-600' />
              </Button>
            </ToolTip>
          </span>
        </AlertDialogTrigger>
        <AlertDialogContent className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0! data-[state=closed]:slide-out-to-top-0! data-[state=open]:slide-in-from-left-0! data-[state=open]:slide-in-from-top-0! top-[30%] max-w-lg p-4'>
          <AlertDialogHeader>
            <AlertDialogTitle className='content flex flex-nowrap items-center gap-2 text-sm font-normal'>
              <Info className='size-8 fill-orange-500 stroke-white' />
              Bạn có chắc chắn muốn xóa thông báo này không ?
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
              onClick={onDeleteClick}
              className='bg-dodger-blue hover:bg-dodger-blue/80 cursor-pointer transition-all duration-200 ease-linear'
            >
              Có
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ListItem>
  );
}
