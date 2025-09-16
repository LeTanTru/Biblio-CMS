import { apiConfig } from '@/constants';
import { ApiResponse } from '@/types';
import { http } from '@/utils';

const authorApiRequest = {
  recover: async (id: string) =>
    await http.put<ApiResponse<any>>(apiConfig.author.recover, {
      pathParams: {
        id
      }
    })
};

export default authorApiRequest;
