'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type AvatarFieldProps = {
  size?: number;
  icon?: React.ReactNode;
  src?: string;
  className?: string;
  previewClassName?: string;
  imagePreviewClassName?: string;
  disablePreview?: boolean;
  zoomSize?: number;
  autosize?: boolean;
  width?: number;
  height?: number;
} & React.HTMLAttributes<HTMLElement>;

export default function AvatarField({
  size = 80,
  zoomSize = 300,
  icon,
  src,
  className,
  previewClassName,
  imagePreviewClassName,
  disablePreview = false,
  autosize = false,
  width,
  height,
  ...props
}: AvatarFieldProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleClick = () => {
    if (!disablePreview && src) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        {...props}
        className={cn(
          'relative flex cursor-pointer items-center justify-center overflow-hidden border shadow-sm',
          className
        )}
        style={{ width: size, height: size }}
        onClick={handleClick}
      >
        {src ? (
          autosize ? (
            <Image src={src} alt='Avatar' fill className='object-cover' />
          ) : (
            <Image
              src={src}
              alt='Avatar'
              width={size}
              height={size}
              className='object-cover'
            />
          )
        ) : (
          icon || <ImageIcon className='h-1/2 w-1/2 opacity-40' />
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className={cn(
                'relative overflow-hidden rounded-full select-none',
                previewClassName
              )}
              style={{ width: width, height: height }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {src &&
                (autosize ? (
                  <Image
                    src={src}
                    alt='Avatar preview'
                    fill
                    className={cn(
                      'rounded-full object-cover',
                      imagePreviewClassName
                    )}
                  />
                ) : (
                  <Image
                    src={src}
                    alt='Avatar preview'
                    width={zoomSize}
                    height={zoomSize}
                    className={cn(
                      'rounded-full object-cover',
                      previewClassName
                    )}
                  />
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
