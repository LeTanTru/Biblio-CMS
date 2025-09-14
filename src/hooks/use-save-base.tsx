'use client';
import { Button, Col, Row } from '@/components/form';
import { CircleLoading } from '@/components/loading';
import useNavigate from '@/hooks/use-navigate';
import { logger } from '@/logger';
import { ApiConfig, ApiResponse } from '@/types';
import { http, notify } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useParams } from 'next/navigation';
import { FieldValues, UseFormReturn } from 'react-hook-form';

type HandlerType<T> = {
  id: () => any;
};

type UseSaveBaseProps<T> = {
  apiConfig: {
    getById: ApiConfig;
    create: ApiConfig;
    update: ApiConfig;
  };
  options: {
    objectName: string;
    listPageUrl?: string;
    key: string;
  };
  override?: (handlers: HandlerType<T>) => HandlerType<T> | void;
};

export default function useSaveBase<T extends FieldValues>({
  apiConfig,
  options: { key = '', objectName = '', listPageUrl = '' },
  override
}: UseSaveBaseProps<T>) {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreate = id === 'create';

  const itemQuery = useQuery({
    queryKey: [objectName, id],
    queryFn: () =>
      http.get<ApiResponse<T>>(apiConfig.getById, {
        pathParams: {
          id
        }
      }),
    enabled: !isCreate
  });

  const data = itemQuery.data?.data;

  const createMutation = useMutation({
    mutationKey: [`create-${objectName}`],
    mutationFn: (body: T) =>
      http.get<ApiResponse<any>>(apiConfig.create, {
        body
      }),
    onSuccess: (res) => {
      if (res.result) {
        notify.success(`Thêm mới ${objectName} thành công`);
        queryClient.invalidateQueries({
          queryKey: [key, id]
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
    mutationKey: [`update-${objectName}`],
    mutationFn: (body: T) =>
      http.get<ApiResponse<any>>(apiConfig.update, {
        body
      }),
    onSuccess: (res) => {
      if (res.result) {
        queryClient.invalidateQueries({
          queryKey: [key, id]
        });
        navigate(listPageUrl);
        notify.success(`Cập nhật ${objectName} thành công`);
      } else {
        logger.error(`Error while creating ${objectName}:`, res);
        notify.error(`Cập nhật ${objectName} thất bại`);
      }
    },
    onError: (error) => {
      logger.error(`Error while updateing ${objectName}:`, error);
      notify.error(`Có lỗi xảy ra khi cập nhật ${objectName}`);
    }
  });

  const loading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (values: T) => {
    const mutation = isCreate ? createMutation : updateMutation;
    await mutation.mutateAsync(isCreate ? { ...values } : { ...values, id });
  };

  const renderActions = (form: UseFormReturn<T>) => (
    <Row className='my-0 justify-end'>
      <Col span={4}>
        <Button
          type='button'
          variant={'ghost'}
          onClick={() => navigate(listPageUrl)}
          className='border border-red-500 text-red-500 hover:border-red-500/50 hover:bg-transparent! hover:text-red-500/50'
        >
          Hủy
        </Button>
      </Col>
      <Col span={4}>
        <Button
          disabled={!form.formState.isDirty || loading}
          type='submit'
          className={
            'bg-dodger-blue hover:bg-dodger-blue hover:opacity-80 disabled:pointer-events-auto disabled:cursor-not-allowed'
          }
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
    loading,
    handleSubmit,
    renderActions
  };
}
