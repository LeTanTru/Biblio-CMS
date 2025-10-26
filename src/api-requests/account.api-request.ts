import { apiConfig } from '@/constants';
import {
  AccountResType,
  AccountSearchType,
  AccountStatisticsResType,
  ApiResponse,
  ApiResponseList,
  ProfileBodyType,
  ProfileResType
} from '@/types';
import { http } from '@/utils';

const accountApiRequest = {
  getProfile: async () =>
    await http.get<ApiResponse<ProfileResType>>(apiConfig.account.getProfile),
  updateProfile: async (body: ProfileBodyType) =>
    await http.put<ApiResponse<any>>(apiConfig.account.updateProfile, {
      body
    }),
  getList: async (params?: AccountSearchType) =>
    await http.get<ApiResponseList<AccountResType>>(apiConfig.account.getList, {
      params
    }),
  delete: async (id: string) =>
    await http.delete<ApiResponse<any>>(apiConfig.account.delete, {
      pathParams: { id }
    }),
  getAccountStatistics: () =>
    http.get<ApiResponse<{ items: AccountStatisticsResType }>>(
      apiConfig.account.getAccountStatistics
    )
};

export default accountApiRequest;
