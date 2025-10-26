import { apiConfig } from '@/constants';
import { ApiResponseList, TopViewedProductResType } from '@/types';
import { http } from '@/utils';

const viewedProductApiRequest = {
  getTopViewedList: () =>
    http.get<ApiResponseList<TopViewedProductResType>>(
      apiConfig.viewedProduct.getTopViewedList
    )
};

export default viewedProductApiRequest;
