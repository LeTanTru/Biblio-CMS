import authApiRequest from '@/api-requests/auth.api-request';
import { LoginBodyType } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (body: LoginBodyType) => await authApiRequest.login(body)
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => await authApiRequest.logout()
  });
};
