'use client';

import { Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingWrapper() {
  return (
    <AnimatePresence>
      <motion.div
        key='overlay'
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 z-50 flex h-dvh w-full items-center justify-center bg-white'
      >
        <Loader className='size-8 animate-spin' />
      </motion.div>
    </AnimatePresence>
  );
}
