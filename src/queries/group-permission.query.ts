'use client';

import { groupPermissionApiRequest } from '@/api-requests';
import { logger } from '@/logger';
import {
  GroupPermissionBodyType,
  GroupPermissionSearchParamType
} from '@/types/group-permission.type';
import { notify } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGroupPermissionListQuery = (
  params?: GroupPermissionSearchParamType
) => {
  return useQuery({
    queryKey: ['group-permission-list', params],
    queryFn: () => groupPermissionApiRequest.getList(params)
  });
};

export const useGroupPermissionQuery = (id: string) => {
  return useQuery({
    queryKey: ['permission', id],
    queryFn: () => groupPermissionApiRequest.getById(id)
  });
};

export const useCreateGroupPermissionMutation = () => {
  return useMutation({
    mutationKey: ['group-permission-create'],
    mutationFn: async (body: Omit<GroupPermissionBodyType, 'id'>) =>
      await groupPermissionApiRequest.create(body)
  });
};

export const useUpdateGroupPermissionMutation = () => {
  return useMutation({
    mutationKey: ['group-permission-update'],
    mutationFn: async (body: GroupPermissionBodyType) =>
      await groupPermissionApiRequest.update(body)
  });
};

export const useDeleteGroupPermissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['group-permission-delete'],
    mutationFn: async (id: string) =>
      await groupPermissionApiRequest.delete(id),
    onSuccess: (res) => {
      if (res.result) {
        queryClient.invalidateQueries({
          queryKey: ['group-permission-list']
        });
        notify.success('Xóa nhóm quyền thành công');
      } else {
        notify.error('Xóa nhóm quyền thất bại');
      }
    },
    onError: (error) => {
      logger.error(`Error while deleting permission: `, error);
      notify.error('Xóa nhóm quyền thất bại');
    }
  });
};
