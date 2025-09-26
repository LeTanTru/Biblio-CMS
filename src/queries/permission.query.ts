'use client';

import { permissionApiRequest } from '@/api-requests';
import { logger } from '@/logger';
import { PermissionBodyType, PermissionSearchType } from '@/types';
import { notify } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const usePermissionListQuery = (params?: PermissionSearchType) => {
  return useQuery({
    queryKey: ['permission-list', params],
    queryFn: () => permissionApiRequest.getList(params)
  });
};

export const usePermissionQuery = (id: string) => {
  return useQuery({
    queryKey: ['permission', id],
    queryFn: () => permissionApiRequest.getById(id)
  });
};

export const useCreatePermissionMutation = () => {
  return useMutation({
    mutationKey: ['permission-create'],
    mutationFn: async (body: Omit<PermissionBodyType, 'id'>) =>
      await permissionApiRequest.create(body)
  });
};

export const useUpdatePermissionMutation = () => {
  return useMutation({
    mutationKey: ['permission-update'],
    mutationFn: async (body: PermissionBodyType) =>
      await permissionApiRequest.update(body)
  });
};

export const useDeletePermissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['permission-delete'],
    mutationFn: async (id: string) => await permissionApiRequest.delete(id),
    onSuccess: (res) => {
      if (res.result) {
        queryClient.invalidateQueries({
          queryKey: ['permission-list']
        });
        notify.success('Xóa quyền thành công');
      } else {
        notify.error('Xóa quyền thất bại');
      }
    },
    onError: (error) => {
      logger.error(`Error while deleting permission: `, error);
      notify.error('Xóa quyền thất bại');
    }
  });
};
