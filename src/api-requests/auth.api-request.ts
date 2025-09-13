import { apiConfig } from '@/constants';
import { ApiResponse } from '@/types';
import { LoginBodyType, LoginResType } from '@/types/auth.type';
import { http } from '@/utils';

const authApiRequest = {
  login: async (body: LoginBodyType) =>
    await http.post<ApiResponse<LoginResType>>(apiConfig.auth.api.login, {
      body
    }),
  loginFromNextServerToServer: async (body: LoginBodyType) =>
    await http.post<ApiResponse<LoginResType>>(apiConfig.auth.login, {
      body
    }),
  logout: async () =>
    await http.post<ApiResponse<any>>(apiConfig.auth.api.logout)
};

export default authApiRequest;
