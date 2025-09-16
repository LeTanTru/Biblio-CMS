import { apiConfig } from '@/constants';
import { ApiResponse } from '@/types';
import { http } from '@/utils';

const translatorApiRequest = {
  recover: async (id: string) =>
    await http.put<ApiResponse<any>>(apiConfig.translator.recover, {
      pathParams: {
        id
      }
    })
};

export default translatorApiRequest;
