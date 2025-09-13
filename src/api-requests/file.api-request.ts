import { apiConfig, uploadOptions } from '@/constants';
import { ApiResponse, UploadImageResponseType } from '@/types';
import { http } from '@/utils';
import { AxiosRequestConfig } from 'axios';

const fileApiRequest = {
  image: async (file: Blob, options?: AxiosRequestConfig) =>
    await http.post<ApiResponse<UploadImageResponseType>>(
      apiConfig.file.upload,
      {
        body: {
          file: file,
          kind: uploadOptions.AVATAR
        },
        options
      }
    )
};

export default fileApiRequest;
