import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  PermissionBodyType,
  PermissionResType,
  PermissionSearchParamType
} from '@/types';
import { http } from '@/utils';

const permissionApiRequest = {
  getList: async (params?: PermissionSearchParamType) =>
    await http.get<ApiResponseList<PermissionResType>>(
      apiConfig.permission.getList,
      {
        params
      }
    ),
  getById: async (id: string) =>
    await http.get<ApiResponse<PermissionResType>>(
      apiConfig.permission.getById,
      {
        pathParams: { id }
      }
    ),
  create: async (body: Omit<PermissionBodyType, 'id'>) =>
    await http.post<ApiResponse<any>>(apiConfig.permission.create, {
      body
    }),
  update: async (body: PermissionBodyType) =>
    await http.put<ApiResponse<any>>(apiConfig.permission.update, {
      body
    }),
  delete: async (id: string) =>
    await http.delete<ApiResponse<any>>(apiConfig.permission.delete, {
      pathParams: {
        id
      }
    })
};

export default permissionApiRequest;
