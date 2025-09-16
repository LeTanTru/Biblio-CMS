import { apiConfig } from '@/constants';
import { ApiResponse } from '@/types';
import { http } from '@/utils';

const publisherApiRequest = {
  recover: async (id: string) =>
    await http.put<ApiResponse<any>>(apiConfig.publisher.recover, {
      pathParams: {
        id
      }
    })
};

export default publisherApiRequest;
