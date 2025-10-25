'use client';

import { Button } from '@/components/form';
import { CircleLoading } from '@/components/loading';
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
import { CMD_CONFIRM_REFUNDED } from '@/constants';
import { logger } from '@/logger';
import { useUpdateOrderStatusMutation } from '@/queries';
import { notify } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Info } from 'lucide-react';

export default function RefundButton({ orderId }: { orderId: string }) {
  const updateOrderStatusMutation = useUpdateOrderStatusMutation();
  const queryClient = useQueryClient();

  const handleRefundOrder = async () => {
    await updateOrderStatusMutation.mutateAsync(
      {
        cmd: CMD_CONFIRM_REFUNDED,
        id: orderId
      },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Đã xác nhận hoàn trả đơn hàng, hoàn tiền');
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
          }
        },
        onError: (error) => {
          logger.error(`Error while confirming order:`, error);
          notify.error('Có lỗi xảy ra');
        }
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span>
          <Button variant={'primary'}>Xác nhận hoàn trả</Button>
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0! data-[state=closed]:slide-out-to-top-0! data-[state=open]:slide-in-from-left-0! data-[state=open]:slide-in-from-top-0! top-[30%] max-w-lg p-4'>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2 text-sm font-normal'>
            <Info className='size-8 fill-orange-500 stroke-white' />
            Bạn có chắc chắn xác nhận hoàn trả đơn hàng ?
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
            className='bg-dodger-blue hover:bg-dodger-blue/80 cursor-pointer transition-all duration-200 ease-linear'
            asChild
          >
            <Button variant={'primary'} onClick={handleRefundOrder}>
              {updateOrderStatusMutation.isPending ? <CircleLoading /> : 'Có'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
