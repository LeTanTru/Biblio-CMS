'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeftIcon,
  UploadIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon
} from 'lucide-react';

import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage
} from '@/components/ui/cropper';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { AvatarField, Button } from '@/components/form';
import { FormLabel } from '@/components/ui/form';
import { cn } from '@/lib';
import { useFileUpload } from '@/hooks';
import { logger } from '@/logger';
import { CircleLoading } from '@/components/loading';
import {
  Control,
  FieldPath,
  FieldValues,
  useController
} from 'react-hook-form';

type Area = { x: number; y: number; width: number; height: number };

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
    });
  } catch (error) {
    logger.error('getCroppedImg error:', error);
    return null;
  }
}

type UploadImageFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: React.ReactNode;
  value?: string;
  onChange?: (url: string) => void;
  required?: boolean;
  labelClassName?: string;
  className?: string;
  size?: number;
  uploadImageFn: (file: Blob) => Promise<string>;
  loading?: boolean;
};

export default function UploadImageField<T extends FieldValues>({
  control,
  name,
  label,
  value,
  onChange,
  required,
  labelClassName,
  className,
  size = 70,
  uploadImageFn,
  loading
}: UploadImageFieldProps<T>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [shouldCrop, setShouldCrop] = useState(false);
  const [zoom, setZoom] = useState(1);
  const {
    field: { value: fieldValue, onChange: fieldOnChange },
    fieldState: { error }
  } = useController({ name, control });

  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
      clearFiles
    }
  ] = useFileUpload({ accept: 'image/*' });

  const previewUrl = files[0]?.preview;

  const fileId = files[0]?.id;
  const previousFileIdRef = useRef<string | null>(null);

  const handleCropChange = useCallback((pixels: Area | null) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    if (!previewUrl || !fileId || !uploadImageFn) return;

    let blob: Blob | null = null;

    if (shouldCrop && croppedAreaPixels) {
      blob = await getCroppedImg(previewUrl, croppedAreaPixels);
    } else {
      const image = await createImage(previewUrl);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/jpeg')
      );
    }

    if (!blob) return;

    try {
      const uploadedUrl = await uploadImageFn(blob);
      onChange?.(uploadedUrl);
      fieldOnChange(uploadedUrl);
      setDialogOpen(false);
    } catch (error) {
      logger.error('Lỗi khi upload ảnh:', error);
    }
  };

  const handleRemove = () => {
    onChange?.('');
    fieldOnChange('');
    clearFiles();
  };

  useEffect(() => {
    if (fileId && fileId !== previousFileIdRef.current) {
      setDialogOpen(true);
      setZoom(1);
      setCroppedAreaPixels(null);
    }
    previousFileIdRef.current = fileId;
  }, [fileId]);

  return (
    <div className='space-y-2'>
      <div className='flex flex-col items-center justify-center gap-y-5'>
        {label && (
          <FormLabel
            className={cn(
              'ml-1 gap-1.5',
              {
                'text-destructive': error?.message
              },
              labelClassName
            )}
          >
            {label}
            {required && <span className='text-destructive'>*</span>}
          </FormLabel>
        )}
        <div className='relative inline-flex'>
          <Button
            variant={'ghost'}
            type='button'
            style={{ width: size, height: size }}
            className={cn(
              'border-input hover:bg-accent/50 focus-visible:border-ring relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed p-0 transition-colors outline-none focus-visible:ring-[3px]',
              className
            )}
            onClick={openFileDialog}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            title={'Tải ảnh lên'}
            data-dragging={isDragging || undefined}
            aria-label={value ? 'Thay ảnh' : 'Tải lên'}
          >
            {!!value ? (
              <AvatarField
                disablePreview
                src={value}
                className='size-full rounded-lg object-cover'
                size={size}
              />
            ) : (
              <UploadIcon
                strokeWidth={1}
                style={{
                  width: size / 2.2,
                  height: size / 2.2
                }}
                className='opacity-60'
              />
            )}
          </Button>

          {value && (
            <Button
              onClick={handleRemove}
              size='icon'
              type='button'
              className='border-background absolute -top-2 -right-2 size-6 rounded-full border-2'
              aria-label='Remove image'
            >
              <XIcon className='size-3.5' />
            </Button>
          )}
          <label htmlFor='input' className='cursor-pointer'>
            <span className='sr-only'>Upload file</span>
            <input
              id='input'
              {...getInputProps()}
              className='sr-only'
              tabIndex={-1}
            />
          </label>
        </div>
        {error?.message && (
          <p className='text-destructive text-sm'>{error.message}</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className='gap-0 p-0 sm:max-w-140'
          showCloseButton={false}
        >
          <DialogHeader className='text-left'>
            <DialogTitle className='flex items-center justify-between border-b p-4 text-base'>
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='-my-1 opacity-60'
                  onClick={() => setDialogOpen(false)}
                >
                  <ArrowLeftIcon />
                </Button>
                <span>Cắt ảnh</span>
              </div>
              <Button
                type='button'
                variant={'primary'}
                className='-my-1 w-25'
                onClick={handleApply}
                disabled={!previewUrl || loading}
              >
                {loading ? <CircleLoading /> : 'Áp dụng'}
              </Button>
            </DialogTitle>
          </DialogHeader>

          {previewUrl && shouldCrop ? (
            <Cropper
              className='h-96 sm:h-120'
              image={previewUrl}
              zoom={zoom}
              onCropChange={handleCropChange}
              onZoomChange={setZoom}
            >
              <CropperDescription />
              <CropperImage />
              <CropperCropArea />
            </Cropper>
          ) : (
            <img
              src={previewUrl}
              alt='Preview'
              className='mx-auto max-h-96 sm:max-h-120'
            />
          )}

          <DialogFooter className='flex flex-col gap-4 border-t px-4 py-6 sm:justify-between'>
            <label className='flex cursor-pointer items-center gap-2'>
              <input
                type='checkbox'
                checked={shouldCrop}
                onChange={(e) => setShouldCrop(e.target.checked)}
              />
              <span className='text-sm'>Cắt ảnh trước khi lưu</span>
            </label>

            {shouldCrop && (
              <div className='mx-auto flex w-full max-w-80 items-center gap-4'>
                <ZoomOutIcon className='shrink-0 opacity-60' size={16} />
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={(val) => setZoom(val[0])}
                />
                <ZoomInIcon className='shrink-0 opacity-60' size={16} />
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
