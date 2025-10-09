import { apiConfig } from '@/constants';
import { ApiResponse, OrderResType, UpdateStatusBodyType } from '@/types';
import { http } from '@/utils';

const orderApiRequest = {
  getById: (id: string) =>
    http.get<ApiResponse<OrderResType>>(apiConfig.order.getById, {
      pathParams: {
        id
      }
    }),
  updateStatus: (body: UpdateStatusBodyType) =>
    http.put<ApiResponse<any>>(apiConfig.order.updateStatus, {
      body
    })
};

export default orderApiRequest;
