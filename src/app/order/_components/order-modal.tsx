'use client';

import { Modal } from '@/components/modal';

export default function OrderModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      Modal
    </Modal>
  );
}
