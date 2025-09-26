'use client';
import {
  AvatarField,
  Button,
  ToolTip,
  UploadImageField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { HasPermission } from '@/components/has-permission';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { CircleLoading } from '@/components/loading';
import { Modal } from '@/components/modal';
import { DragDropTable } from '@/components/table';
import { Badge } from '@/components/ui/badge';
import {
  apiConfig,
  DEFAULT_TABLE_PAGE_START,
  MAX_PAGE_SIZE
} from '@/constants';
import { useDisclosure, useDragDrop, useListBase, useSaveBase } from '@/hooks';
import { logger } from '@/logger';
import { useUploadImageProduct } from '@/queries';
import { productImageSchema, productSearchSchema } from '@/schemaValidations';
import {
  ApiResponse,
  Column,
  ProductImageBodyType,
  ProductImageResType,
  ProductImageSearchType,
  ProductResType
} from '@/types';
import { http, notify, renderImageUrl } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Edit2,
  FileImage,
  PlusIcon,
  Save,
  X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib';
import './product-image-modal.css';

export default function ProductImageModal({
  data,
  open,
  onClose
}: {
  data: ProductResType | null;
  open: boolean;
  onClose: () => void;
}) {
  const { opened, open: openForm, close } = useDisclosure();
  const {
    opened: openedPreviewImages,
    open: openPreviewImages,
    close: closePreviewImages
  } = useDisclosure();
  const [url, setUrl] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState(0);
  const uploadImageMutation = useUploadImageProduct();
  const setDefaultMutation = useMutation({
    mutationKey: ['product-image-set-default'],
    mutationFn: (id: string) =>
      http.post<ApiResponse<any>>(apiConfig.productImage.setDefault, {
        body: {
          id
        }
      })
  });
  const {
    data: productImages,
    loading,
    handlers,
    listQuery,
    setData
  } = useListBase<ProductImageResType, ProductImageSearchType>({
    apiConfig: apiConfig.productImage,
    options: {
      queryKey: 'product-image',
      objectName: 'ảnh sách',
      enabled: open,
      excludeFromQueryFilter: [...Object.keys(productSearchSchema.shape)]
    },
    override: (handlers) => {
      handlers.additionalParams = () => ({
        productId: data?.id,
        page: DEFAULT_TABLE_PAGE_START,
        size: MAX_PAGE_SIZE
      });
      handlers.renderAddButton = () => {
        return (
          <HasPermission
            requiredPermissions={[apiConfig.productImage.create.permissionCode]}
          >
            <Button onClick={handleAddClick} variant={'primary'}>
              <PlusIcon />
              Thêm mới
            </Button>
          </HasPermission>
        );
      };
      handlers.additionalColumns = () => ({
        edit: (
          record: ProductImageResType,
          buttonProps?: Record<string, any>
        ) => {
          return (
            <HasPermission
              requiredPermissions={[
                apiConfig.productImage.update.permissionCode as string
              ]}
            >
              <ToolTip title={`Sửa ảnh sách`}>
                <span>
                  <Button
                    onClick={() => handleEditClick(record)}
                    className='border-none bg-transparent shadow-none hover:bg-transparent'
                    {...buttonProps}
                  >
                    <Edit2 className='stroke-dodger-blue size-3.5' />
                  </Button>
                </span>
              </ToolTip>
            </HasPermission>
          );
        },
        setDefault: (
          record: ProductImageResType,
          buttonProps?: Record<string, any>
        ) => {
          return (
            <HasPermission
              requiredPermissions={[
                apiConfig.productImage.setDefault.permissionCode as string
              ]}
            >
              <ToolTip title={`Đặt làm ảnh mặc định`}>
                <span>
                  <Button
                    disabled={record.isDefault}
                    onClick={() => handleSetImageDefault(record)}
                    className='border-none bg-transparent shadow-none hover:bg-transparent'
                    {...buttonProps}
                  >
                    <Check className='stroke-dodger-blue size-4' />
                  </Button>
                </span>
              </ToolTip>
            </HasPermission>
          );
        }
      });
    }
  });

  const {
    data: productImage,
    handleSubmit,
    renderActions,
    setDetailId
  } = useSaveBase<ProductImageResType, ProductImageBodyType>({
    apiConfig: apiConfig.productImage,
    options: {
      queryKey: 'product-image',
      objectName: 'ảnh'
    }
  });

  const {
    sortColumn,
    loading: loadingUpdateOrdering,
    sortedData,
    isChanged,
    onDragEnd,
    handleUpdate
  } = useDragDrop<ProductImageResType>({
    key: 'product-image-list',
    objectName: 'ảnh sách',
    data: productImages,
    apiConfig: apiConfig.productImage.updateOrdering,
    sortField: 'ordering'
  });

  const columns: Column<ProductImageResType>[] = [
    ...(sortedData.length > 1 ? [sortColumn] : []),
    // {
    //   title: '#',
    //   render: (_, __, index) =>
    //     (pagination.current - 1) * pagination.pageSize + index + 1,
    //   width: 50,
    //   align: 'center'
    // },
    {
      title: 'Ảnh',
      dataIndex: 'url',
      render: (value, record, index) => {
        return (
          <div className='flex items-center gap-2'>
            <AvatarField
              size={50}
              src={renderImageUrl(value)}
              className='rounded'
              previewClassName='object-contain rounded'
              imagePreviewClassName='rounded object-contain'
              disablePreview={true}
              icon={<FileImage />}
              autosize={true}
              height={600}
              width={600}
              onClick={() => handlePreview(index)}
            />
            {record.isDefault && (
              <Badge className='pointer-events-none h-8 rounded-full bg-lime-600'>
                Mặc định
              </Badge>
            )}
          </div>
        );
      }
    },
    handlers.renderActionColumn({
      actions: {
        edit: true,
        setDefault: true,
        delete: true
      },
      columnProps: {
        width: 120
      }
    })
  ];

  const handleAddClick = () => {
    openForm();
    setDetailId('');
  };

  const handleClose = () => {
    close();
    setUrl('');
  };

  const handleEditClick = (record: ProductImageResType) => {
    setDetailId(record.id);
    openForm();
  };

  const handleSetImageDefault = async (record: ProductImageResType) => {
    await setDefaultMutation.mutateAsync(record.id.toString(), {
      onSuccess: (res) => {
        if (res.result) {
          notify.success('Đặt làm ảnh mặc định thành công');
          listQuery.refetch().then((res) => {
            setData(res.data?.data.content || []);
          });
        } else {
          notify.error('Đặt làm ảnh mặc định thất bại');
        }
      },
      onError: (error) => {
        logger.error('Error while set default product image:', error);
      }
    });
  };

  const handlePreview = (index: number) => {
    setActiveIndex(index);
    openPreviewImages();
  };

  const defaultValues: ProductImageBodyType = {
    url: '',
    productId: '',
    isDefault: false
  };

  const initialValues: ProductImageBodyType = useMemo(
    () => ({
      url: renderImageUrl(productImage?.url),
      productId: data?.id ?? '',
      isDefault: productImage?.isDefault ?? false
    }),
    [data?.id, productImage?.isDefault, productImage?.url]
  );

  useEffect(() => {
    if (productImage?.url) {
      setUrl(productImage.url);
    }
  }, [productImage?.url]);

  const onSubmit = async (values: ProductImageBodyType) => {
    await handleSubmit({ ...values });
    listQuery.refetch();
    handleClose();
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <ListPageWrapper
          className='mx-2 my-2 h-[90vh] w-200 overflow-y-auto max-2xl:w-200'
          addButton={handlers.renderAddButton()}
          reloadButton={handlers.renderReloadButton()}
        >
          <DragDropTable
            onDragEnd={onDragEnd}
            dataSource={sortedData}
            columns={columns}
            loading={loading}
          />
          {sortedData.length > 1 && (
            <div className='mr-4 flex justify-end py-4'>
              <Button
                onClick={async () => {
                  await handleUpdate();
                  await listQuery.refetch();
                }}
                disabled={!isChanged || loading || loadingUpdateOrdering}
                className='w-40'
                variant={'primary'}
              >
                {loadingUpdateOrdering ? (
                  <CircleLoading />
                ) : (
                  <>
                    <Save />
                    Cập nhật
                  </>
                )}
              </Button>
            </div>
          )}
        </ListPageWrapper>
      </Modal>
      <Modal open={opened} onClose={close}>
        <BaseForm
          defaultValues={defaultValues}
          initialValues={initialValues}
          schema={productImageSchema}
          onSubmit={onSubmit}
          className='h-75 w-150 max-[1560px]:w-120'
        >
          {(form) => (
            <>
              <UploadImageField
                size={180}
                label='Tải lên ảnh sách'
                control={form.control}
                name='url'
                required
                loading={uploadImageMutation.isPending}
                value={renderImageUrl(url)}
                onChange={(url) => setUrl(url)}
                uploadImageFn={async (file: Blob) => {
                  const res = await uploadImageMutation.mutateAsync({ file });
                  return res.data?.filePath ?? '';
                }}
              />
              <div className='mt-4'>
                {renderActions(form, { onCancel: handleClose })}
              </div>
            </>
          )}
        </BaseForm>
      </Modal>
      <ImagePreview
        images={sortedData.map((item) => renderImageUrl(item.url))}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        onClose={closePreviewImages}
        open={openedPreviewImages}
      />
    </>
  );
}

function ImagePreview({
  images,
  activeIndex,
  setActiveIndex,
  onClose,
  open
}: {
  open: boolean;
  images: string[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  onClose: () => void;
}) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prev = () =>
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  const next = () => setActiveIndex((activeIndex + 1) % images.length);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeIndex]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      className='fixed inset-0 z-50 [&>div]:rounded-none [&>div]:bg-black/80'
      variants={{
        initial: {
          scale: 0.8,
          opacity: 0
        },
        animate: {
          scale: 1,
          opacity: 1
        },
        exit: {
          scale: 0.8,
          opacity: 0
        }
      }}
    >
      <div
        className='group flex h-dvh w-dvw flex-col items-center justify-center rounded-lg px-4'
        onClick={onClose}
      >
        <Button
          variant={'destructive'}
          onClick={onClose}
          className='absolute top-2 right-2 z-1 text-white opacity-0 group-hover:opacity-50 hover:opacity-100'
        >
          <X size={28} />
        </Button>

        <div className='relative flex h-4/5 w-full items-center'>
          <Button
            variant={'ghost'}
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className='absolute left-0 px-1! text-white opacity-0 transition-all duration-300 ease-linear group-hover:opacity-100 hover:bg-transparent! [&>svg]:size-7! [&>svg]:stroke-white/50 [&>svg]:transition-all [&>svg]:duration-200 [&>svg]:ease-in hover:[&>svg]:stroke-white'
          >
            <ChevronLeft size={36} />
          </Button>
          <AnimatePresence mode='wait'>
            <motion.img
              key={images[activeIndex]}
              src={images[activeIndex]}
              alt=''
              className='h-full w-full rounded-lg object-contain'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            />
          </AnimatePresence>
          <Button
            variant={'ghost'}
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className='absolute right-0 px-1! text-white opacity-0 transition-all duration-300 ease-linear group-hover:opacity-100 hover:bg-transparent! [&>svg]:size-7! [&>svg]:stroke-white/50 [&>svg]:transition-all [&>svg]:duration-200 [&>svg]:ease-in hover:[&>svg]:stroke-white'
          >
            <ChevronRight size={36} />
          </Button>
        </div>
        <div
          ref={scrollRef}
          className='scrollbar-hide mt-6 flex w-full max-w-[90vw] cursor-grab gap-3 overflow-x-auto active:cursor-grabbing'
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {images.map((src, i) => (
            <div
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              key={src}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-3 border-solid',
                {
                  'border-dodger-blue': i === activeIndex,
                  'border-white opacity-60': i !== activeIndex
                }
              )}
            >
              <Image
                src={src}
                alt=''
                width={80}
                height={80}
                className='pointer-events-none h-full w-full object-cover'
                unoptimized
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
