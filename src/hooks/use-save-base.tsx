'use client';

import { Button, Col, Row } from '@/components/form';
import { CircleLoading } from '@/components/loading';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import useNavigate from '@/hooks/use-navigate';
import { logger } from '@/logger';
import { ApiConfig, ApiResponse } from '@/types';
import { http, notify } from '@/utils';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftFromLine, Info, Save } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

type HandlerType<T> = {
  id: () => any;
};

type UseSaveBaseProps<R, T> = {
  apiConfig: {
    getById: ApiConfig;
    create: ApiConfig;
    update: ApiConfig;
  };
  options: {
    objectName: string;
    listPageUrl?: string;
    queryKey: string;
  };
  override?: (handlers: HandlerType<T>) => HandlerType<T> | void;
};

export default function useSaveBase<
  R extends FieldValues,
  T extends FieldValues
>({
  apiConfig,
  options: { queryKey = '', objectName = '', listPageUrl = '' },
  override
}: UseSaveBaseProps<R, T>) {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [detailId, setDetailId] = useState('');
  const navigate = useNavigate();
  const isCreate = !detailId || detailId === 'create';

  useEffect(() => {
    if (id) setDetailId(id);
  }, [id]);

  const itemQuery = useQuery({
    queryKey: [queryKey, detailId],
    queryFn: () =>
      http.get<ApiResponse<R>>(apiConfig.getById, {
        pathParams: {
          id: detailId
        }
      }),
    enabled: !isCreate
  });

  const data = itemQuery.data?.data;

  useEffect(() => {
    if (detailId) itemQuery.refetch();
  }, [detailId]);

  const createMutation = useMutation({
    mutationKey: [`create-${queryKey}`],
    mutationFn: (body: T) =>
      http.get<ApiResponse<any>>(apiConfig.create, {
        body
      }),
    onSuccess: (res) => {
      if (res.result) {
        notify.success(`Thêm mới ${objectName} thành công`);
        queryClient.invalidateQueries({
          queryKey: [queryKey, detailId]
        });
      } else {
        logger.error(`Error while creating ${objectName}:`, res);
        notify.error(`Thêm mới ${objectName} thất bại`);
      }
    },
    onError: (error) => {
      logger.error(`Error while creating ${objectName}:`, error);
      notify.error(`Có lỗi xảy ra khi thêm mới ${objectName}`);
    }
  });

  const updateMutation = useMutation({
    mutationKey: [`update-${queryKey}`],
    mutationFn: (body: T) =>
      http.get<ApiResponse<any>>(apiConfig.update, {
        body
      }),
    onSuccess: (res) => {
      if (res.result) {
        queryClient.invalidateQueries({
          queryKey: [queryKey, detailId]
        });
        notify.success(`Cập nhật ${objectName} thành công`);
      } else {
        logger.error(`Error while creating ${objectName}:`, res);
        notify.error(`Cập nhật ${objectName} thất bại`);
      }
    },
    onError: (error) => {
      logger.error(`Error while updating ${objectName}:`, error);
      notify.error(`Có lỗi xảy ra khi cập nhật ${objectName}`);
    }
  });

  const loading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (values: T) => {
    const mutation = isCreate ? createMutation : updateMutation;
    await mutation.mutateAsync(
      isCreate ? { ...values } : { ...values, id: values.id ?? id }
    );
    if (listPageUrl) navigate(listPageUrl);
  };

  const renderActions = (
    form: UseFormReturn<T>,
    options?: { onCancel?: () => void }
  ) => (
    <Row className='my-0 justify-end'>
      <Col span={4}>
        {!form.formState.isDirty ? (
          <Button
            type='button'
            variant={'ghost'}
            onClick={() =>
              listPageUrl ? navigate(listPageUrl) : options?.onCancel?.()
            }
            className='border border-red-500 text-red-500 hover:border-red-500/50 hover:bg-transparent! hover:text-red-500/50'
          >
            <ArrowLeftFromLine />
            Hủy
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type='button'
                variant={'ghost'}
                className='border border-red-500 text-red-500 hover:border-red-500/50 hover:bg-transparent! hover:text-red-500/50'
              >
                <ArrowLeftFromLine />
                Hủy
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0! data-[state=closed]:slide-out-to-top-0! data-[state=open]:slide-in-from-left-0! data-[state=open]:slide-in-from-top-0! top-[30%]'>
              <AlertDialogHeader>
                <AlertDialogTitle className='text-md flex items-center gap-2 font-normal'>
                  <Info className='size-8 fill-orange-500 stroke-white' />
                  Bạn có chắc chắn muốn quay lại không ?
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
                <Button
                  onClick={() => navigate(listPageUrl)}
                  variant={'primary'}
                >
                  Có
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </Col>
      <Col span={4}>
        <Button
          disabled={!form.formState.isDirty || loading}
          type='submit'
          variant={'primary'}
        >
          {loading ? (
            <CircleLoading />
          ) : (
            <>
              <Save />
              {isCreate ? 'Thêm' : 'Cập nhật'}
            </>
          )}
        </Button>
      </Col>
    </Row>
  );

  return {
    data,
    detailId,
    handleSubmit,
    itemQuery,
    loading: loading || itemQuery.isLoading || itemQuery.isFetching,
    renderActions,
    setDetailId
  };
}
