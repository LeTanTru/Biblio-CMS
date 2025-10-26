'use client';

import { Button } from '@/components/form';
import { Modal } from '@/components/modal';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { CMD_REJECT_ORDER } from '@/constants';
import useDisclosure from '@/hooks/use-disclosure';
import { logger } from '@/logger';
import { useUpdateOrderStatusMutation } from '@/queries';
import { notify } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function RejectOrderButton({
  orderId,
  onSuccess
}: {
  orderId: string;
  onSuccess?: () => void;
}) {
  const { opened, open, close } = useDisclosure();
  const handlOpenRejectOrderModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    open();
  };
  return (
    <>
      <Button
        onClick={handlOpenRejectOrderModal}
        className='text-destructive border-destructive hover:text-destructive/80 hover:border-destructive/80 transition-all duration-200 ease-linear'
        variant={'outline'}
      >
        Từ chối đơn hàng
      </Button>
      <RejectOrderModal
        opened={opened}
        onClose={close}
        orderId={orderId}
        onSuccess={onSuccess}
      />
    </>
  );
}

function RejectOrderModal({
  orderId,
  opened,
  onClose,
  onSuccess
}: {
  orderId: string;
  onClose: () => void;
  opened: boolean;
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const [rejectReason, setRejectReason] = useState('');
  const updateOrderStatusMutation = useUpdateOrderStatusMutation();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRejectReason(e.target.value);
  };

  const handleRejectRefundOrder = async () => {
    await updateOrderStatusMutation.mutateAsync(
      { id: orderId, cmd: CMD_REJECT_ORDER },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Từ chối đơn hàng thành công');
            queryClient.invalidateQueries({
              queryKey: ['order', orderId]
            });
            onClose();
            onSuccess?.();
          }
        },
        onError: (error) => {
          logger.error('Error whiling reject order:', error);
          notify.error('Có lỗi xảy ra');
        }
      }
    );
  };

  return (
    <Modal open={opened} onClose={onClose} className='p-4'>
      <div className='flex max-h-[90vh] w-140 flex-col'>
        <div className='flex items-center gap-x-4 py-2'>
          <div className='pl-4'>
            <h3 className='font-semibold'>Từ chối đơn hàng</h3>
          </div>
          <Button
            onClick={onClose}
            className='text-destructive ml-auto'
            variant={'ghost'}
          >
            <X />
          </Button>
        </div>
        <Separator />

        <div className='p-4'>
          <Textarea
            onChange={(e) => handleChange(e)}
            placeholder='Lý do từ chối đơn hàng'
            className='order-note focus-visible:ring-dodger-blue max-h-80 min-h-40 overflow-auto focus-visible:border-transparent focus-visible:ring-2 focus-visible:outline-none'
          />
        </div>

        <Separator />

        <div className='flex justify-end p-4'>
          <Button
            variant={'primary'}
            onClick={handleRejectRefundOrder}
            disabled={rejectReason.length === 0}
          >
            Gửi
          </Button>
        </div>
      </div>
    </Modal>
  );
}
