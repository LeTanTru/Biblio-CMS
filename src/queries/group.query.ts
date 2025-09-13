'use client';

import { groupApiRequest } from '@/api-requests';
import { ErrorCode } from '@/constants';
import { logger } from '@/logger';
import { GroupBodyType, GroupSearchParamType } from '@/types';
import { notify } from '@/utils';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';

export const useGroupListQuery = (params?: GroupSearchParamType) => {
  return useQuery({
    queryKey: ['group-list', params],
    queryFn: async () => await groupApiRequest.getList(params),
    placeholderData: keepPreviousData
  });
};

export const useGroupQuery = (id: string) => {
  return useQuery({
    queryKey: ['group', id],
    queryFn: async () => await groupApiRequest.getById(id),
    enabled: !!id && id !== 'create'
  });
};

export const useCreateGroupMutation = () => {
  return useMutation({
    mutationKey: ['group-create'],
    mutationFn: async (body: Omit<GroupBodyType, 'id'>) =>
      await groupApiRequest.create(body)
  });
};

export const useUpdateGroupMutation = () => {
  return useMutation({
    mutationKey: ['group-update'],
    mutationFn: async (body: GroupBodyType) =>
      await groupApiRequest.update(body)
  });
};

export const useDeleteGroupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['group-delete'],
    mutationFn: async (id: string) => await groupApiRequest.delete(id),
    onSuccess: (res) => {
      if (res.result) {
        queryClient.invalidateQueries({ queryKey: ['group-list'] });
        notify.success('Xóa nhóm thành công');
      } else {
        const errCode = res.code;
        if (errCode === ErrorCode.GROUP_ERROR_IN_USED) {
          notify.error('Nhóm này đang được sử dụng, không thể xóa');
        } else {
          notify.error('Xóa nhóm thất bại');
        }
      }
    },
    onError: (error) => {
      logger.error(`Error while deleting group: `, error);
      notify.error('Xóa nhóm thất bại');
    }
  });
};
