import { apiConfig, uploadOptions } from '@/constants';
import { ApiResponse, UploadImageResponseType } from '@/types';
import { http } from '@/utils';
import { AxiosRequestConfig } from 'axios';

const fileApiRequest = {
  uploadAvatar: async (file: Blob, options?: AxiosRequestConfig) =>
    await http.post<ApiResponse<UploadImageResponseType>>(
      apiConfig.file.upload,
      {
        body: {
          file: file,
          kind: uploadOptions.AVATAR
        },
        options
      }
    ),
  uploadProductImage: async (file: Blob, options?: AxiosRequestConfig) =>
    await http.post<ApiResponse<UploadImageResponseType>>(
      apiConfig.file.upload,
      {
        body: {
          file: file,
          kind: uploadOptions.SYSTEM
        },
        options
      }
    )
};

export default fileApiRequest;
