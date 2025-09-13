import { apiConfig } from '@/constants';
import { ApiResponse, ApiResponseList } from '@/types';
import {
  GroupPermissionBodyType,
  GroupPermissionResType,
  GroupPermissionSearchParamType
} from '@/types/group-permission.type';
import { http } from '@/utils';

const groupPermissionApiRequest = {
  getList: async (params?: GroupPermissionSearchParamType) =>
    await http.get<ApiResponseList<GroupPermissionResType>>(
      apiConfig.groupPermission.getList,
      {
        params
      }
    ),
  getById: async (id: string) =>
    await http.get<ApiResponse<GroupPermissionBodyType>>(
      apiConfig.groupPermission.getById,
      {
        pathParams: { id }
      }
    ),
  create: async (body: Omit<GroupPermissionBodyType, 'id'>) =>
    await http.post<ApiResponse<any>>(apiConfig.groupPermission.create, {
      body
    }),
  update: async (body: GroupPermissionBodyType) =>
    await http.put<ApiResponse<any>>(apiConfig.groupPermission.update, {
      body
    }),
  delete: async (id: string) =>
    await http.delete<ApiResponse<any>>(apiConfig.groupPermission.delete, {
      pathParams: {
        id
      }
    })
};

export default groupPermissionApiRequest;
