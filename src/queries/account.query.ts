'use client';

import { accountApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { logger } from '@/logger';
import { useAuthStore } from '@/store';
import { AccountSearchType, ProfileBodyType } from '@/types';
import { notify } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useProfileQuery = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => await accountApiRequest.getProfile(),
    enabled: enabled
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationKey: ['update-profile'],
    mutationFn: async (body: ProfileBodyType) =>
      await accountApiRequest.updateProfile(body),
    onSuccess: async () => {
      const res = await accountApiRequest.getProfile();
      useAuthStore.getState().setProfile(res.data!);
    }
  });
};

export const useAccountListQuery = (params?: AccountSearchType) => {
  return useQuery({
    queryKey: ['account-list', params],
    queryFn: () => accountApiRequest.getList(params)
  });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['account-delete'],
    mutationFn: async (id: string) => await accountApiRequest.delete(id),
    onSuccess: (res) => {
      if (res.result) {
        queryClient.invalidateQueries({
          queryKey: ['account-list']
        });
        notify.success('Xóa tài khoản thành công');
      } else {
        const errorCode = res.code;
        logger.error('🚀 ~ useDeleteAccountMutation ~ errorCode:', errorCode);
        notify.error('Xóa tài khoản thất bại');
      }
    },
    onError: (error) => {
      logger.error(`Error while deleting category: `, error);
      notify.error('Xóa danh mục thất bại');
    }
  });
};

export const useAccountStatisticsQuery = ({
  enabled
}: {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [`${queryKeys.ACCOUNT}-statistics`],
    queryFn: () => accountApiRequest.getAccountStatistics(),
    enabled
  });
};
