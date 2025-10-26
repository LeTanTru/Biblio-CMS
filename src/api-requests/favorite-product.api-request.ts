import { apiConfig } from '@/constants';
import { ApiResponseList, TopFavoriteProductResType } from '@/types';
import { http } from '@/utils';

const favoriteProductApiRequest = {
  getTopFavoriteList: () =>
    http.get<ApiResponseList<TopFavoriteProductResType>>(
      apiConfig.favorite.getTopFavoriteList
    )
};

export default favoriteProductApiRequest;
