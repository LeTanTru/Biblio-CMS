import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  CategoryAutoResType,
  CategoryBodyType,
  CategoryResType,
  CategorySearchParamType,
  UpdateOrderingType
} from '@/types';
import { http } from '@/utils';

const categoryApiRequest = {
  getList: async (params?: CategorySearchParamType) =>
    await http.get<ApiResponseList<CategoryResType>>(
      apiConfig.category.getList,
      {
        params
      }
    ),
  getById: async (id: string) =>
    await http.get<ApiResponse<CategoryResType>>(apiConfig.category.getById, {
      pathParams: {
        id
      }
    }),
  create: async (body: Omit<CategoryBodyType, 'id'>) =>
    await http.post<ApiResponse<any>>(apiConfig.category.create, {
      body
    }),
  update: async (body: CategoryBodyType) =>
    await http.put<ApiResponse<any>>(apiConfig.category.update, {
      body
    }),
  delete: async (id: string) =>
    await http.delete<ApiResponse<any>>(apiConfig.category.delete, {
      pathParams: {
        id
      }
    }),
  autoComplete: async (params?: CategorySearchParamType) =>
    await http.get<ApiResponseList<CategoryAutoResType>>(
      apiConfig.category.autoComplete,
      {
        params
      }
    ),
  updateOrdering: async (body: UpdateOrderingType) =>
    await http.put<ApiResponse<any>>(apiConfig.category.updateOrdering, {
      body
    }),
  recover: async (id: string) =>
    await http.put<ApiResponse<any>>(apiConfig.category.recover, {
      pathParams: {
        id
      }
    })
};

export default categoryApiRequest;
