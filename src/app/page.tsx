'use client';

import { LoadingWrapper } from '@/components/loading';
import { AnimatePresence } from 'framer-motion';

export default function HomePage() {
  return (
    <AnimatePresence>
      <LoadingWrapper key='loading' />
    </AnimatePresence>
  );
}
