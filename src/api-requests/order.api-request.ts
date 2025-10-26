import { apiConfig } from '@/constants';
import {
  ApiResponse,
  OrderResType,
  OrderStatusRatioResType,
  RevenueResType,
  RevenueStatisticsResType,
  UpdateStatusBodyType
} from '@/types';
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
    }),
  getRevenue: () =>
    http.get<ApiResponse<RevenueResType>>(apiConfig.order.revenue),
  getNewCustomerCount: () =>
    http.get<ApiResponse<{ totalAccounts: number }>>(
      apiConfig.account.countNewUser
    ),
  getStatusRatio: () =>
    http.get<ApiResponse<OrderStatusRatioResType>>(
      apiConfig.order.getStatusRatio
    ),
  getRevenueStatistics: () =>
    http.get<ApiResponse<{ items: RevenueStatisticsResType }>>(
      apiConfig.order.getRevenueStatistics
    )
};

export default orderApiRequest;
